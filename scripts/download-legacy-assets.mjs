import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();

const DEFAULT_JUNK_PAGE_REGEX =
  "sample-page|testpage|hello-world|default-redirect-page|member-tos-page|public-individual-page|login-customizer|activate|subscription-plan|membership|my-account";

const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="#11172b"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#c8d4ff" font-family="Arial" font-size="32">Codex Placeholder</text></svg>`;

function hasFlag(argv, key) {
  return argv.includes(key);
}

function getArg(argv, key) {
  const idx = argv.indexOf(key);
  if (idx === -1) return null;
  return argv[idx + 1] ?? null;
}

function getMultiArg(argv, key) {
  const out = [];
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === key && argv[i + 1]) out.push(argv[i + 1]);
  }
  return out;
}

function parseArgs(argv) {
  const sitemaps = getMultiArg(argv, "--sitemap");

  return {
    out: getArg(argv, "--out") ?? "public/assets/legacy",
    manifest: getArg(argv, "--manifest") ?? "data/assets-manifest.json",
    indexPath: getArg(argv, "--index") ?? "data/assets-index.json",
    allowHost: getArg(argv, "--allow-host") ?? "slabhead.co.za",
    maxPages: Number(getArg(argv, "--max-pages") ?? "80"),
    maxAssets: Number(getArg(argv, "--max-assets") ?? "600"),
    concurrency: Number(getArg(argv, "--concurrency") ?? "6"),
    requestTimeoutMs: Number(getArg(argv, "--timeout-ms") ?? "12000"),
    clean: hasFlag(argv, "--clean"),
    regen: hasFlag(argv, "--regen"),
    resume: hasFlag(argv, "--resume"),
    optimise: hasFlag(argv, "--optimise"),
    dedupe: hasFlag(argv, "--dedupe"),
    excludePageRegex: getArg(argv, "--exclude-page-regex") ?? DEFAULT_JUNK_PAGE_REGEX,
    excludeAssetRegex: getArg(argv, "--exclude-asset-regex") ?? "",
    sitemaps:
      sitemaps.length > 0
        ? sitemaps
        : [
            "https://slabhead.co.za/sitemap.xml",
            "https://slabhead.co.za/page-sitemap.xml",
            "https://slabhead.co.za/product-sitemap1.xml",
            "https://slabhead.co.za/product-sitemap2.xml",
            "https://slabhead.co.za/category-sitemap.xml",
          ],
  };
}

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'");
}

function normalizeUrl(url, base) {
  try {
    const normalized = new URL(url, base);
    normalized.hash = "";
    return normalized.toString();
  } catch {
    return null;
  }
}

function cleanName(value) {
  return value.replace(/[^a-z0-9-]+/gi, "-").replace(/-+/g, "-").replace(/(^-|-$)/g, "").toLowerCase();
}

function parseMetaTags(html) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  return tags.map((tag) => {
    const attrs = {};
    for (const m of tag.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(["'])(.*?)\2/g)) {
      attrs[m[1].toLowerCase()] = m[3];
    }
    return attrs;
  });
}

function collectJsonLdImages(node, out, pageUrl) {
  if (!node) return;
  if (Array.isArray(node)) {
    for (const item of node) collectJsonLdImages(item, out, pageUrl);
    return;
  }
  if (typeof node !== "object") return;

  const image = node.image ?? node.thumbnailUrl ?? node.contentUrl;
  if (typeof image === "string") {
    const url = normalizeUrl(image, pageUrl);
    if (url) out.add(url);
  } else if (Array.isArray(image)) {
    for (const item of image) {
      if (typeof item === "string") {
        const url = normalizeUrl(item, pageUrl);
        if (url) out.add(url);
      } else if (item && typeof item === "object" && typeof item.url === "string") {
        const url = normalizeUrl(item.url, pageUrl);
        if (url) out.add(url);
      }
    }
  } else if (image && typeof image === "object" && typeof image.url === "string") {
    const url = normalizeUrl(image.url, pageUrl);
    if (url) out.add(url);
  }

  for (const value of Object.values(node)) collectJsonLdImages(value, out, pageUrl);
}

function extractHtmlImageUrls(html, pageUrl) {
  const urls = new Set();

  for (const attrs of parseMetaTags(html)) {
    const key = (attrs.property ?? attrs.name ?? "").toLowerCase();
    if (key === "og:image" && attrs.content) {
      const image = normalizeUrl(attrs.content, pageUrl);
      if (image) urls.add(image);
    }
  }

  for (const m of html.matchAll(/<img\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1/gi)) {
    const image = normalizeUrl(m[2], pageUrl);
    if (image) urls.add(image);
  }

  for (const m of html.matchAll(/\bsrcset\s*=\s*(["'])(.*?)\1/gi)) {
    for (const candidate of m[2].split(",")) {
      const firstPart = candidate.trim().split(/\s+/)[0];
      if (!firstPart) continue;
      const image = normalizeUrl(firstPart, pageUrl);
      if (image) urls.add(image);
    }
  }

  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = m[1].trim();
    if (!raw) continue;
    try {
      collectJsonLdImages(JSON.parse(raw), urls, pageUrl);
    } catch {
      // ignore malformed json-ld
    }
  }

  return [...urls];
}

function extractSitemapData(xml) {
  const pageUrls = new Set();
  const imageToPages = new Map();

  for (const blockMatch of xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)) {
    const block = blockMatch[1] ?? "";
    const locRaw = block.match(/<loc>(.*?)<\/loc>/i)?.[1] ?? "";
    const pageUrl = decodeXml(locRaw.trim());

    if (pageUrl && !pageUrl.endsWith(".xml")) pageUrls.add(pageUrl);

    for (const imageMatch of block.matchAll(/<image:loc>(.*?)<\/image:loc>/gi)) {
      const imageUrl = decodeXml(imageMatch[1].trim());
      if (!imageToPages.has(imageUrl)) imageToPages.set(imageUrl, new Set());
      if (pageUrl) imageToPages.get(imageUrl).add(pageUrl);
    }
  }

  return { pageUrls, imageToPages };
}

function extFromMimeOrUrl(mime, imageUrl) {
  const type = (mime || "").toLowerCase();
  if (type.includes("image/jpeg")) return ".jpg";
  if (type.includes("image/png")) return ".png";
  if (type.includes("image/webp")) return ".webp";
  if (type.includes("image/avif")) return ".avif";
  if (type.includes("image/gif")) return ".gif";
  if (type.includes("image/svg")) return ".svg";
  const ext = path.extname(new URL(imageUrl).pathname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"].includes(ext)) return ext === ".jpeg" ? ".jpg" : ext;
  return ".jpg";
}

function classifyBucket(imageUrl, sourcePages) {
  const combined = `${imageUrl} ${sourcePages.join(" ")}`.toLowerCase();
  if (combined.includes("/product/") || combined.includes("woocommerce") || combined.includes("/product-category/")) return "products";
  if (
    combined.includes("slabhunter") ||
    combined.includes("slabtrader") ||
    combined.includes("we-buy-cards") ||
    combined.includes("slabbing") ||
    combined.includes("loan-broker") ||
    combined.includes("service")
  ) {
    return "services";
  }
  if (combined.includes("categories") || combined.includes("pokemon") || combined.includes("yu-gi-oh") || combined.includes("magic")) {
    return "categories";
  }
  return "brand";
}

function classifyRights(imageUrl, sourcePages) {
  const combined = `${imageUrl} ${sourcePages.join(" ")}`.toLowerCase();
  const thirdPartyHints = [
    "dall",
    "midjourney",
    "unsplash",
    "pexels",
    "shutterstock",
    "pixabay",
    "freepik",
    "artstation",
    "anime-ai",
    "by-",
  ];
  if (thirdPartyHints.some((needle) => combined.includes(needle))) return "likely_third_party";
  if (sourcePages.some((p) => p.includes("slabhead.co.za"))) return "first_party";
  return "unknown";
}

function extractDimensions(buffer, mime) {
  const type = (mime || "").toLowerCase();

  if (type.includes("image/png") || (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47)) {
    if (buffer.length >= 24) return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  if (type.includes("image/gif") || (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46)) {
    if (buffer.length >= 10) return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  }

  if (type.includes("image/webp") || (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP")) {
    const chunk = buffer.toString("ascii", 12, 16);
    if (chunk === "VP8X" && buffer.length >= 30) {
      return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
    }
  }

  if (type.includes("image/jpeg") || (buffer[0] === 0xff && buffer[1] === 0xd8)) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      if (marker === 0xd9 || marker === 0xda) break;
      const size = buffer.readUInt16BE(offset + 2);
      if (size < 2) break;
      offset += 2 + size;
    }
  }

  if (type.includes("image/svg") || buffer.toString("utf8", 0, 256).includes("<svg")) {
    const raw = buffer.toString("utf8", 0, Math.min(buffer.length, 8192));
    const widthAttr = raw.match(/\bwidth\s*=\s*['\"]([0-9.]+)(px)?['\"]/i)?.[1];
    const heightAttr = raw.match(/\bheight\s*=\s*['\"]([0-9.]+)(px)?['\"]/i)?.[1];
    if (widthAttr && heightAttr) return { width: Math.round(Number(widthAttr)), height: Math.round(Number(heightAttr)) };
    const viewBox = raw.match(/\bviewBox\s*=\s*['\"]([0-9.\s-]+)['\"]/i)?.[1];
    if (viewBox) {
      const parts = viewBox.trim().split(/\s+/).map(Number);
      if (parts.length === 4) return { width: Math.round(parts[2]), height: Math.round(parts[3]) };
    }
  }

  return { width: null, height: null };
}

function isLikelyImagePayload(mime, buffer) {
  if ((mime || "").toLowerCase().startsWith("image/")) return true;
  if (buffer.length < 12) return false;
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return true;
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true;
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return true;
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") return true;
  if (buffer.toString("utf8", 0, 256).includes("<svg")) return true;
  return false;
}

async function ensureDir(targetPath) {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
}

async function fileExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function fetchWithTimeout(url, timeoutMs) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
    redirect: "follow",
    headers: { "accept-encoding": "gzip,deflate,br" },
  });
  if (!response.ok) throw new Error(`HTTP_${response.status}`);
  return response;
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let index = 0;
  const workers = Array.from({ length: Math.max(1, limit) }, async () => {
    while (true) {
      const i = index;
      index += 1;
      if (i >= items.length) break;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

async function writeJson(filePath, value) {
  const abs = path.join(ROOT, filePath);
  await ensureDir(abs);
  await fs.writeFile(abs, JSON.stringify(value, null, 2) + "\n", "utf8");
}

async function loadManifestEntries(filePath) {
  const abs = path.join(ROOT, filePath);
  if (!(await fileExists(abs))) return [];
  try {
    const raw = JSON.parse(await fs.readFile(abs, "utf8"));
    if (Array.isArray(raw)) return raw;
    if (raw && Array.isArray(raw.entries)) return raw.entries;
  } catch {
    // ignore
  }
  return [];
}

function toPublicPath(rel) {
  return `/${path.posix.relative("public", rel)}`;
}

async function optimiseVariants({ buffer, absPath, relPath, width, dedupeMap, dedupe }) {
  const variants = [];
  if (!width || width < 600) return variants;
  const targetWidth = Math.min(1280, width);
  const parsed = path.parse(absPath);

  for (const format of ["webp", "avif"]) {
    const variantAbs = path.join(parsed.dir, "variants", `${parsed.name}-w${targetWidth}.${format}`);
    await ensureDir(variantAbs);

    let out;
    if (format === "webp") {
      out = await sharp(buffer).resize({ width: targetWidth, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
    } else {
      out = await sharp(buffer).resize({ width: targetWidth, withoutEnlargement: true }).avif({ quality: 52 }).toBuffer();
    }

    const hash = sha256(out);
    let finalRel = path.posix.join(path.posix.dirname(relPath), "variants", `${path.parse(relPath).name}-w${targetWidth}.${format}`);

    if (dedupe && dedupeMap.has(hash)) {
      finalRel = dedupeMap.get(hash);
    } else {
      if (!(await fileExists(variantAbs))) {
        await fs.writeFile(variantAbs, out);
      }
      dedupeMap.set(hash, finalRel);
    }

    variants.push({
      format,
      width: targetWidth,
      newPath: toPublicPath(finalRel),
      mime: format === "webp" ? "image/webp" : "image/avif",
      bytes: out.length,
      sha256: hash,
    });
  }

  return variants;
}

async function savePlaceholder({ cfg, imageUrl, sourcePages, bucket, reason }) {
  const hash = sha256(imageUrl).slice(0, 16);
  const rel = path.posix.join(cfg.out, "placeholders", `${hash}.svg`);
  const abs = path.join(ROOT, rel);
  await ensureDir(abs);
  await fs.writeFile(abs, placeholderSvg, "utf8");

  return {
    oldUrl: imageUrl,
    newPath: toPublicPath(rel),
    sourcePage: sourcePages[0] ?? null,
    mime: "image/svg+xml",
    width: 1200,
    height: 800,
    sha256: sha256(Buffer.from(placeholderSvg, "utf8")),
    rightsStatus: "failed",
    notes: `download_failed:${reason};placeholder_created;bucket=${bucket};sources=${sourcePages.length}`,
    variants: [],
    bucket,
  };
}

async function downloadOne({ imageUrl, sourcePages, cfg, dedupeMap }) {
  const bucket = classifyBucket(imageUrl, sourcePages);
  const baseName = cleanName(path.basename(new URL(imageUrl).pathname, path.extname(new URL(imageUrl).pathname))) || "asset";
  const urlHash = sha256(imageUrl).slice(0, 10);

  try {
    const response = await fetchWithTimeout(imageUrl, cfg.requestTimeoutMs);
    const buffer = Buffer.from(await response.arrayBuffer());
    const mime = response.headers.get("content-type") || "application/octet-stream";
    if (!isLikelyImagePayload(mime, buffer)) {
      throw new Error(`NON_IMAGE_PAYLOAD:${mime}`);
    }

    const ext = extFromMimeOrUrl(mime, imageUrl);
    const primaryRel = path.posix.join(cfg.out, bucket, `${baseName}${ext}`);
    const primaryAbs = path.join(ROOT, primaryRel);
    const hashedRel = path.posix.join(cfg.out, bucket, `${baseName}-${urlHash}${ext}`);
    const hashedAbs = path.join(ROOT, hashedRel);
    await ensureDir(primaryAbs);

    const hash = sha256(buffer);
    let finalRel = primaryRel;

    const isDeduped = cfg.dedupe && dedupeMap.has(hash);
    if (isDeduped) {
      finalRel = dedupeMap.get(hash);
    } else {
      finalRel = primaryRel;
      if (await fileExists(primaryAbs)) {
        const existing = await fs.readFile(primaryAbs);
        if (sha256(existing) !== hash) {
          finalRel = hashedRel;
          await ensureDir(hashedAbs);
          await fs.writeFile(hashedAbs, buffer);
        } else {
          finalRel = primaryRel;
        }
      } else {
        await fs.writeFile(primaryAbs, buffer);
      }
      dedupeMap.set(hash, finalRel);
    }

    const dims = extractDimensions(buffer, mime);
    const variants = cfg.optimise
      ? await optimiseVariants({
          buffer,
          absPath: path.join(ROOT, finalRel),
          relPath: finalRel,
          width: dims.width,
          dedupeMap,
          dedupe: cfg.dedupe,
        })
      : [];

    return {
      oldUrl: imageUrl,
      newPath: toPublicPath(finalRel),
      sourcePage: sourcePages[0] ?? null,
      mime,
      width: dims.width,
      height: dims.height,
      sha256: hash,
      rightsStatus: classifyRights(imageUrl, sourcePages),
      notes: `${isDeduped ? "deduped;" : ""}downloaded;bucket=${bucket};sources=${sourcePages.length}`,
      variants,
      bucket,
    };
  } catch (error) {
    return savePlaceholder({ cfg, imageUrl, sourcePages, bucket, reason: String(error) });
  }
}

function buildAssetsIndex(entries) {
  const successful = entries.filter((e) => e.newPath && e.rightsStatus !== "failed");

  const toIndexItem = (e) => {
    const preferred1280 =
      e.variants?.find((v) => v.width === 1280 && v.format === "avif") ??
      e.variants?.find((v) => v.width === 1280 && v.format === "webp") ??
      null;

    return {
      path: preferred1280?.newPath ?? e.newPath,
      originalPath: e.newPath,
      oldUrl: e.oldUrl,
      sourcePage: e.sourcePage,
      rightsStatus: e.rightsStatus,
      width: e.width,
      height: e.height,
      variants: e.variants ?? [],
    };
  };

  const heroCandidates = successful
    .filter((e) => (e.bucket === "brand" || e.bucket === "categories") && e.rightsStatus !== "likely_third_party")
    .filter((e) => (e.width ?? 0) >= 900 || String(e.mime).includes("svg"))
    .slice(0, 120)
    .map(toIndexItem);

  const productImages = successful.filter((e) => e.bucket === "products").slice(0, 500).map(toIndexItem);
  const serviceImages = successful.filter((e) => e.bucket === "services").slice(0, 240).map(toIndexItem);
  const categoryImages = successful.filter((e) => e.bucket === "categories").slice(0, 240).map(toIndexItem);

  return {
    generatedAt: new Date().toISOString(),
    heroCandidates,
    productImages,
    serviceImages,
    categoryImages,
  };
}

async function main() {
  const cfg = parseArgs(process.argv.slice(2));
  const pageExclude = new RegExp(cfg.excludePageRegex || DEFAULT_JUNK_PAGE_REGEX, "i");
  const assetExclude = cfg.excludeAssetRegex ? new RegExp(cfg.excludeAssetRegex, "i") : null;

  const outAbs = path.join(ROOT, cfg.out);
  if (cfg.clean) {
    await fs.rm(outAbs, { recursive: true, force: true });
    await fs.rm(path.join(ROOT, cfg.manifest), { force: true });
    await fs.rm(path.join(ROOT, cfg.indexPath), { force: true });
  }

  await fs.mkdir(outAbs, { recursive: true });

  const previousEntries = cfg.resume && !cfg.regen ? await loadManifestEntries(cfg.manifest) : [];
  const previousByUrl = new Map(previousEntries.map((e) => [e.oldUrl, e]));
  const dedupeMap = new Map();
  for (const e of previousEntries) {
    if (e.sha256 && e.newPath && e.rightsStatus !== "failed") {
      dedupeMap.set(e.sha256, path.posix.join("public", e.newPath.replace(/^\//, "")));
    }
  }

  const pageUrls = new Set();
  const imageToSources = new Map();

  for (const sitemapUrl of cfg.sitemaps) {
    const xml = await (await fetchWithTimeout(sitemapUrl, cfg.requestTimeoutMs)).text();
    const { pageUrls: pages, imageToPages } = extractSitemapData(xml);

    for (const page of pages) {
      if (!pageExclude.test(page)) pageUrls.add(page);
    }

    for (const [imageUrl, sources] of imageToPages) {
      if (assetExclude?.test(imageUrl)) continue;
      if (!imageToSources.has(imageUrl)) imageToSources.set(imageUrl, new Set());
      for (const source of sources) {
        if (!pageExclude.test(source)) imageToSources.get(imageUrl).add(source);
      }
    }
  }

  const sampledPages = [...pageUrls].slice(0, Math.max(0, cfg.maxPages));
  const sampled = await mapLimit(sampledPages, cfg.concurrency, async (pageUrl) => {
    try {
      const html = await (await fetchWithTimeout(pageUrl, cfg.requestTimeoutMs)).text();
      const images = extractHtmlImageUrls(html, pageUrl);
      for (const imageUrl of images) {
        if (assetExclude?.test(imageUrl)) continue;
        if (!imageToSources.has(imageUrl)) imageToSources.set(imageUrl, new Set());
        imageToSources.get(imageUrl).add(pageUrl);
      }
      return { url: pageUrl, ok: true, imagesFound: images.length };
    } catch (error) {
      return { url: pageUrl, ok: false, imagesFound: 0, error: String(error) };
    }
  });

  const downloadTargets = [...imageToSources.entries()]
    .map(([url, sourceSet]) => ({ imageUrl: url, sourcePages: [...sourceSet].sort() }))
    .filter(({ imageUrl, sourcePages }) => {
      try {
        const hostname = new URL(imageUrl).hostname;
        if (!(hostname === cfg.allowHost || hostname === `www.${cfg.allowHost}`)) return false;
      } catch {
        return false;
      }
      if (assetExclude?.test(imageUrl)) return false;
      if (sourcePages.length === 0) return false;
      return true;
    })
    .slice(0, Math.max(0, cfg.maxAssets));

  const entries = [];
  await mapLimit(downloadTargets, cfg.concurrency, async (target, index) => {
    if ((index + 1) % 25 === 0 || index === 0) {
      console.log(`downloading ${index + 1}/${downloadTargets.length}`);
    }

    if (cfg.resume && !cfg.regen && previousByUrl.has(target.imageUrl)) {
      entries[index] = previousByUrl.get(target.imageUrl);
      return;
    }

    entries[index] = await downloadOne({ imageUrl: target.imageUrl, sourcePages: target.sourcePages, cfg, dedupeMap });
  });

  const finalEntries = entries.filter(Boolean).sort((a, b) => a.oldUrl.localeCompare(b.oldUrl));

  const manifest = {
    generatedAt: new Date().toISOString(),
    options: {
      out: cfg.out,
      allowHost: cfg.allowHost,
      maxPages: cfg.maxPages,
      maxAssets: cfg.maxAssets,
      concurrency: cfg.concurrency,
      clean: cfg.clean,
      regen: cfg.regen,
      resume: cfg.resume,
      optimise: cfg.optimise,
      dedupe: cfg.dedupe,
      excludePageRegex: cfg.excludePageRegex,
      excludeAssetRegex: cfg.excludeAssetRegex,
    },
    sitemaps: cfg.sitemaps,
    sampledPages: sampled,
    totals: {
      foundImageUrls: imageToSources.size,
      processed: finalEntries.length,
      downloaded: finalEntries.filter((e) => e.rightsStatus !== "failed").length,
      failed: finalEntries.filter((e) => e.rightsStatus === "failed").length,
      likelyThirdParty: finalEntries.filter((e) => e.rightsStatus === "likely_third_party").length,
    },
    entries: finalEntries,
  };

  const assetsIndex = buildAssetsIndex(finalEntries);

  await writeJson(cfg.manifest, manifest);
  await writeJson(cfg.indexPath, assetsIndex);

  console.log(`Saved manifest entries: ${finalEntries.length}`);
  console.log(`Downloaded: ${manifest.totals.downloaded}, placeholders: ${manifest.totals.failed}`);
  console.log(`Sampled pages: ${sampled.filter((x) => x.ok).length}/${sampled.length}`);
  console.log(`Manifest path: ${cfg.manifest}`);
  console.log(`Assets index path: ${cfg.indexPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
