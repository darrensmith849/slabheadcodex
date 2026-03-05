import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/commerce/provider";
import { siteConfig } from "@/config/site";

const staticRoutes = [
  "",
  "/shop",
  "/collectables",
  "/pokemon-categories",
  "/yu-gi-oh-categories",
  "/magic-the-gathering-categories",
  "/contact-us",
  "/about-us",
  "/privacy-policy",
  "/terms-of-service",
  "/services-categories",
  "/slabhunter",
  "/slabtrader",
  "/we-buy-cards",
  "/slabbing",
  "/loan-broker",
  "/culture",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = await listProducts();

  const baseEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteConfig.siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.siteUrl}/product/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...baseEntries, ...productEntries];
}
