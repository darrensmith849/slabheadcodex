import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const scanDirs = ["src", "public", "data", ".next"];
const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".mjs",
  ".json",
  ".txt",
  ".html",
  ".css",
  ".md",
  ".xml",
  ".map",
]);

const forbidden = [
  /slabhead\.co\.za\/wp-content/gi,
  /https?:\/\/slabhead\.co\.za\/[^"]+\.(jpg|jpeg|png|webp|gif|svg)/gi,
];

async function walk(dir) {
  const full = path.join(root, dir);
  try {
    const entries = await fs.readdir(full, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const rel = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await walk(rel)));
      } else {
        files.push(rel);
      }
    }
    return files;
  } catch {
    return [];
  }
}

function shouldScan(file) {
  const ext = path.extname(file).toLowerCase();
  if (!ext) return true;
  return textExtensions.has(ext);
}

async function main() {
  const files = (await Promise.all(scanDirs.map((dir) => walk(dir)))).flat().filter(shouldScan);
  const violations = [];

  for (const file of files) {
    const absolute = path.join(root, file);
    if (file === path.join("data", "assets-manifest.json")) { continue; }
    const content = await fs.readFile(absolute, "utf8");

    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (file === path.join("data", "assets-manifest.json") && line.includes('"oldUrl"')) {
        continue;
      }
      for (const pattern of forbidden) {
        pattern.lastIndex = 0;
        if (pattern.test(line)) {
          violations.push(`${file}:${i + 1}: ${line.trim()}`);
        }
      }
    }
  }

  if (violations.length > 0) {
    console.error("Hotlink check failed. Forbidden references found:");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log(`Hotlink check passed across ${files.length} files.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
