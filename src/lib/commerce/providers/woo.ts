import type { CommerceProvider } from "@/lib/commerce/types";

function notConfigured(): never {
  throw new Error(
    "WooCommerce provider is scaffolded but not configured. Set WOO_BASE_URL, WOO_CONSUMER_KEY, and WOO_CONSUMER_SECRET.",
  );
}

export const wooProvider: CommerceProvider = {
  async getProductBySlug() {
    return notConfigured();
  },

  async listProducts() {
    return notConfigured();
  },

  async searchProducts() {
    return notConfigured();
  },

  async listCategories() {
    return notConfigured();
  },
};
