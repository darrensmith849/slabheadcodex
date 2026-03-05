import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

type IndexedAsset = {
  path: string;
  originalPath?: string;
  width?: number | null;
  height?: number | null;
  variants?: Array<{
    format: "webp" | "avif" | string;
    width: number;
    newPath: string;
  }>;
};

type AssetsIndex = {
  heroCandidates?: IndexedAsset[];
};

export type HeroBackgroundSelection = {
  primary: string;
  secondary: string;
};

const FALLBACKS = [
  "/assets/legacy/brand/screenshot-2025-01-16-at-14-34-44.jpg",
  "/assets/legacy/brand/screenshot-2025-01-16-at-14-34-54.jpg",
  "/assets/legacy/services/scene-02.jpg",
];

const loadAssetsIndex = cache(async (): Promise<AssetsIndex> => {
  const file = path.join(process.cwd(), "data/assets-index.json");
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as AssetsIndex;
  } catch {
    return { heroCandidates: [] };
  }
});

function hashPathname(pathname: string) {
  let hash = 0;
  for (let i = 0; i < pathname.length; i += 1) {
    hash = (hash * 31 + pathname.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function pickPreferredPath(asset: IndexedAsset) {
  const variants = asset.variants ?? [];
  const avif1280 = variants.find((v) => v.width >= 1200 && v.format === "avif")?.newPath;
  if (avif1280) return avif1280;
  const webp1280 = variants.find((v) => v.width >= 1200 && v.format === "webp")?.newPath;
  if (webp1280) return webp1280;
  return asset.path;
}

export async function getHeroBackgroundForPath(pathname: string): Promise<HeroBackgroundSelection> {
  const index = await loadAssetsIndex();
  const candidates = (index.heroCandidates ?? [])
    .map((asset) => pickPreferredPath(asset))
    .filter((item): item is string => typeof item === "string" && item.startsWith("/assets/"));

  if (candidates.length === 0) {
    return {
      primary: FALLBACKS[0],
      secondary: FALLBACKS[1],
    };
  }

  const unique = [...new Set(candidates)];
  const hash = hashPathname(pathname || "/");
  const p1 = unique[hash % unique.length] ?? FALLBACKS[0];
  const p2 = unique[(hash * 7 + 11) % unique.length] ?? FALLBACKS[1];

  if (p1 === p2) {
    return {
      primary: p1,
      secondary: unique[(hash + 1) % unique.length] ?? FALLBACKS[2],
    };
  }

  return {
    primary: p1,
    secondary: p2,
  };
}
