import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const manifestPath = path.join(ROOT, "data/assets-manifest.json");
const indexPath = path.join(ROOT, "data/assets-index.json");

const validRights = new Set(["first_party", "likely_third_party", "unknown", "failed"]);

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function fail(message) {
  console.error(`ASSET_VERIFY_FAIL: ${message}`);
  process.exitCode = 1;
}

function toAbsolutePublicPath(publicPath) {
  const rel = publicPath.replace(/^\//, "");
  return path.join(ROOT, "public", rel.replace(/^assets\//, "assets/"));
}

async function main() {
  if (!(await exists(manifestPath))) {
    throw new Error("Missing data/assets-manifest.json");
  }
  if (!(await exists(indexPath))) {
    throw new Error("Missing data/assets-index.json");
  }

  const manifestRaw = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  const indexRaw = JSON.parse(await fs.readFile(indexPath, "utf8"));

  const entries = Array.isArray(manifestRaw) ? manifestRaw : manifestRaw.entries;
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error("Manifest has no entries");
  }

  const seenPaths = new Set();
  for (const entry of entries) {
    if (!entry.oldUrl || typeof entry.oldUrl !== "string") fail(`entry missing oldUrl: ${JSON.stringify(entry).slice(0, 120)}`);
    if (!validRights.has(entry.rightsStatus)) fail(`invalid rightsStatus for ${entry.oldUrl}: ${entry.rightsStatus}`);

    if (entry.newPath && typeof entry.newPath === "string") {
      if (!entry.newPath.startsWith("/assets/")) fail(`newPath not local asset path: ${entry.newPath}`);
      if (/slabhead\.co\.za/i.test(entry.newPath)) fail(`newPath appears hotlinked: ${entry.newPath}`);

      const abs = toAbsolutePublicPath(entry.newPath);
      if (!(await exists(abs))) fail(`file missing for newPath: ${entry.newPath}`);
      seenPaths.add(entry.newPath);
    }

    if (Array.isArray(entry.variants)) {
      for (const variant of entry.variants) {
        if (!variant.newPath?.startsWith("/assets/")) fail(`variant path invalid for ${entry.oldUrl}`);
        const abs = toAbsolutePublicPath(variant.newPath);
        if (!(await exists(abs))) fail(`variant file missing: ${variant.newPath}`);
      }
    }
  }

  const collections = ["heroCandidates", "productImages", "serviceImages", "categoryImages"];
  for (const key of collections) {
    const list = indexRaw[key];
    if (!Array.isArray(list)) fail(`assets-index missing array: ${key}`);
    for (const item of list ?? []) {
      if (!item.path?.startsWith("/assets/")) fail(`assets-index ${key} has invalid path`);
      if (!seenPaths.has(item.originalPath ?? item.path)) {
        // allow variant preferred paths; ensure at least current path exists on disk
        const abs = toAbsolutePublicPath(item.path);
        if (!(await exists(abs))) fail(`assets-index ${key} path missing on disk: ${item.path}`);
      }
    }
  }

  const failed = entries.filter((e) => e.rightsStatus === "failed").length;
  const likelyThirdParty = entries.filter((e) => e.rightsStatus === "likely_third_party").length;
  console.log(`Assets verify passed. entries=${entries.length} failed=${failed} likely_third_party=${likelyThirdParty}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
