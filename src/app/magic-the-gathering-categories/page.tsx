import type { Metadata } from "next";
import { CategoryHub } from "@/components/commerce/category-hub";
import { searchProducts } from "@/lib/commerce/provider";

export const metadata: Metadata = {
  title: "Magic The Gathering Categories",
  description: "MTG slabbed and sealed highlights from Slabhead.",
  alternates: {
    canonical: "/magic-the-gathering-categories",
  },
};

export default async function MagicCategoriesPage() {
  const products = await searchProducts({ game: "mtg" });

  return (
    <CategoryHub
      title="Magic The Gathering Categories"
      description="Curated MTG inventory focused on collector value, grading confidence, and premium presentation."
      image="/assets/legacy/categories/magic-the-gathering-card-swords-to-plowshares3.jpg"
      products={products}
    />
  );
}
