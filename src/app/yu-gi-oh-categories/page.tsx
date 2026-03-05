import type { Metadata } from "next";
import { CategoryHub } from "@/components/commerce/category-hub";
import { searchProducts } from "@/lib/commerce/provider";

export const metadata: Metadata = {
  title: "Yu-Gi-Oh Categories",
  description: "Yu-Gi-Oh slabbed and sealed highlights from Codex.",
  alternates: {
    canonical: "/yu-gi-oh-categories",
  },
};

export default async function YugiohCategoriesPage() {
  const products = await searchProducts({ game: "yugioh" });

  return (
    <CategoryHub
      title="Yu-Gi-Oh Categories"
      description="Explore classic and modern Yu-Gi-Oh inventory with transparent stock status and premium collector presentation."
      image="/assets/legacy/categories/yu-gi-oh-slabbed.jpg"
      products={products}
    />
  );
}
