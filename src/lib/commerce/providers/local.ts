import { categories, products } from "@/data/catalogue";
import type { CommerceProvider, Product, SearchFilters } from "@/lib/commerce/types";

function applyFilters(items: Product[], filters?: SearchFilters): Product[] {
  if (!filters) {
    return items;
  }

  return items.filter((product) => {
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = `${product.name} ${product.description} ${product.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(q)) {
        return false;
      }
    }

    if (filters.category && product.category !== filters.category) {
      return false;
    }

    if (filters.game && product.game !== filters.game) {
      return false;
    }

    if (filters.gradeCompany && product.gradeCompany?.toLowerCase() !== filters.gradeCompany.toLowerCase()) {
      return false;
    }

    if (filters.gradeScore && product.gradeScore !== filters.gradeScore) {
      return false;
    }

    if (typeof filters.minPrice === "number" && product.offer.price < filters.minPrice) {
      return false;
    }

    if (typeof filters.maxPrice === "number" && product.offer.price > filters.maxPrice) {
      return false;
    }

    if (filters.availability && product.offer.availability !== filters.availability) {
      return false;
    }

    return true;
  });
}

export const localProvider: CommerceProvider = {
  async getProductBySlug(slug) {
    return products.find((item) => item.slug === slug) ?? null;
  },

  async listProducts() {
    return [...products];
  },

  async searchProducts(filters) {
    return applyFilters(products, filters);
  },

  async listCategories() {
    return [...categories];
  },
};
