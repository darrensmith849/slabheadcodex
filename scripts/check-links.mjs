import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const appDir = path.join(root, "src", "app");
const routeFiles = [];
const routeSet = new Set(["/"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.name === "page.tsx") {
      routeFiles.push(full);
      const relative = path.relative(appDir, path.dirname(full)).split(path.sep).join("/");
      if (!relative.includes("[") && relative !== "") {
        routeSet.add(`/${relative}`);
      }
    }
  }
}

async function main() {
  await walk(appDir);
  const hrefPattern = /href="(\/[^"]*)"/g;
  const broken = [];

  for (const file of routeFiles) {
    const content = await fs.readFile(file, "utf8");
    for (const match of content.matchAll(hrefPattern)) {
      const href = match[1].replace(/\/$/, "") || "/";
      if (href.startsWith("/product/") || href.startsWith("/api/")) continue;
      if (!routeSet.has(href)) {
        broken.push(`${path.relative(root, file)} -> ${href}`);
      }
    }
  }

  if (broken.length > 0) {
    console.error("Internal link check failed:");
    for (const item of broken) console.error(`- ${item}`);
    process.exit(1);
  }

  console.log(`Internal link check passed for ${routeFiles.length} route files.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
