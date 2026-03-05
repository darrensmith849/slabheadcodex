import { localProvider } from "@/lib/commerce/providers/local";
import { wooProvider } from "@/lib/commerce/providers/woo";
import type { Category, Product, SearchFilters } from "@/lib/commerce/types";

function resolveProvider() {
  const hasWooEnv =
    process.env.WOO_BASE_URL && process.env.WOO_CONSUMER_KEY && process.env.WOO_CONSUMER_SECRET;

  if (process.env.COMMERCE_PROVIDER === "woo" && hasWooEnv) {
    return wooProvider;
  }

  return localProvider;
}

const provider = resolveProvider();

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return provider.getProductBySlug(slug);
}

export async function listProducts(): Promise<Product[]> {
  return provider.listProducts();
}

export async function searchProducts(filters?: SearchFilters): Promise<Product[]> {
  return provider.searchProducts(filters);
}

export async function listCategories(): Promise<Category[]> {
  return provider.listCategories();
}
