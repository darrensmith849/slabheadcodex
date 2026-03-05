import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const manifestPath = path.join(ROOT, "data", "assets-manifest.json");
const publicRoot = path.join(ROOT, "public");

const sitemapUrls = [
  "https://slabhead.co.za/page-sitemap.xml",
  "https://slabhead.co.za/product-sitemap1.xml",
  "https://slabhead.co.za/product-sitemap2.xml",
];

const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#11172b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#c8d4ff" font-family="Arial" font-size="32">Codex Placeholder</text></svg>`;

const maxPages = Number(process.env.ASSET_MAX_PAGES ?? 100);
const maxAssets = Number(process.env.ASSET_MAX_IMAGES ?? 350);
const requestTimeoutMs = Number(process.env.ASSET_TIMEOUT_MS ?? 12000);

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function extFromUrl(url) {
  const raw = new URL(url).pathname;
  const ext = path.extname(raw).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(ext)) return ext;
  return ".jpg";
}

function cleanName(value) {
  return value.replace(/[^a-z0-9-]+/gi, "-").replace(/-+/g, "-").replace(/(^-|-$)/g, "").toLowerCase();
}

function classifyBucket(imageUrl, sourcePage) {
  const lower = `${imageUrl} ${sourcePage ?? ""}`.toLowerCase();
  if (lower.includes("/product/") || lower.includes("psa") || lower.includes("cgc") || lower.includes("bgs")) return "products";
  if (lower.includes("slabhunter") || lower.includes("slabtrader") || lower.includes("we-buy-cards") || lower.includes("slabbing") || lower.includes("loan-broker") || lower.includes("services")) return "services";
  if (lower.includes("categories") || lower.includes("pokemon") || lower.includes("yu-gi-oh") || lower.includes("magic")) return "categories";
  return "brand";
}

function rightsStatusFor(url) {
  const lower = url.toLowerCase();
  if (lower.includes("dall") || lower.includes("book") || lower.includes("art") || lower.includes("murakami") || lower.includes("kusama")) return "flagged";
  return "reviewed-first-party-product";
}

async function fetchWithTimeout(url) {
  const signal = AbortSignal.timeout(requestTimeoutMs);
  const response = await fetch(url, {
    headers: { "accept-encoding": "gzip,deflate,br" },
    signal,
  });
  if (!response.ok) throw new Error(`HTTP_${response.status}`);
  return response;
}

async function fetchText(url) {
  const response = await fetchWithTimeout(url);
  return response.text();
}

function extractMatches(input, pattern) {
  return [...input.matchAll(pattern)].map((m) => m[1]).filter(Boolean);
}

function extractImageUrlsFromHtml(html) {
  const urls = new Set();
  for (const item of extractMatches(html, /<meta\s+property="og:image"\s+content="([^"]+)"/gi)) urls.add(item);
  for (const item of extractMatches(html, /<img[^>]+src="([^"]+)"/gi)) {
    if (item.includes("/wp-content/uploads/")) urls.add(item);
  }
  for (const block of extractMatches(html, /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(block);
      const stack = [parsed];
      while (stack.length) {
        const node = stack.pop();
        if (!node) continue;
        if (typeof node === "string") {
          if (node.includes("/wp-content/uploads/")) urls.add(node);
        } else if (Array.isArray(node)) {
          stack.push(...node);
        } else if (typeof node === "object") {
          for (const value of Object.values(node)) stack.push(value);
        }
      }
    } catch {
      // ignore malformed json-ld
    }
  }
  return [...urls];
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function downloadImage(url, sourcePage) {
  const bucket = classifyBucket(url, sourcePage);
  const ext = extFromUrl(url);
  const basename = cleanName(path.basename(new URL(url).pathname, ext)) || sha256(url).slice(0, 12);
  const relPath = path.posix.join("/assets/legacy", bucket, `${basename}${ext}`);
  const absPath = path.join(publicRoot, relPath.replace(/^\//, ""));

  try {
    const response = await fetchWithTimeout(url);
    const bytes = Buffer.from(await response.arrayBuffer());
    await ensureDir(absPath);
    await fs.writeFile(absPath, bytes);

    return {
      oldUrl: url,
      newPath: relPath,
      sourcePage: sourcePage ?? "",
      mime: response.headers.get("content-type") ?? "application/octet-stream",
      width: null,
      height: null,
      sha256: sha256(bytes),
      rightsStatus: rightsStatusFor(url),
      notes: "downloaded",
    };
  } catch (error) {
    const fallbackRel = path.posix.join("/assets/legacy/placeholders", `${sha256(url).slice(0, 16)}.svg`);
    const fallbackAbs = path.join(publicRoot, fallbackRel.replace(/^\//, ""));
    await ensureDir(fallbackAbs);
    await fs.writeFile(fallbackAbs, placeholderSvg);

    return {
      oldUrl: url,
      newPath: fallbackRel,
      sourcePage: sourcePage ?? "",
      mime: "image/svg+xml",
      width: 1200,
      height: 800,
      sha256: sha256(placeholderSvg),
      rightsStatus: "flagged",
      notes: `download_failed:${String(error)}`,
    };
  }
}

async function main() {
  const pageUrls = new Set();
  const imageToSource = new Map();

  for (const sitemap of sitemapUrls) {
    const xml = await fetchText(sitemap);
    let lastPage = "";

    for (const loc of extractMatches(xml, /<loc>([^<]+)<\/loc>/gi)) {
      if (loc.includes("/wp-content/uploads/")) continue;
      if (!loc.endsWith(".xml")) {
        pageUrls.add(loc);
        lastPage = loc;
      }
    }

    for (const imageLoc of extractMatches(xml, /<image:loc>([^<]+)<\/image:loc>/gi)) {
      imageToSource.set(imageLoc, lastPage);
    }
  }

  const sampledPages = [...pageUrls].slice(0, maxPages);
  for (const pageUrl of sampledPages) {
    try {
      const html = await fetchText(pageUrl);
      for (const imageUrl of extractImageUrlsFromHtml(html)) {
        if (!imageToSource.has(imageUrl)) imageToSource.set(imageUrl, pageUrl);
      }
    } catch {
      // skip page fetch failures
    }
  }

  const onlyUploads = [...imageToSource.entries()]
    .filter(([url]) => url.includes("slabhead.co.za/wp-content/uploads/"))
    .slice(0, maxAssets);

  const manifest = [];
  let i = 0;
  for (const [imageUrl, sourcePage] of onlyUploads) {
    i += 1;
    if (i % 25 === 0) {
      console.log(`downloading ${i}/${onlyUploads.length}`);
    }
    manifest.push(await downloadImage(imageUrl, sourcePage));
  }

  manifest.sort((a, b) => a.oldUrl.localeCompare(b.oldUrl));
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`Saved manifest entries: ${manifest.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
