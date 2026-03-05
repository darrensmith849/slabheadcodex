import type { Metadata } from "next";
import { CategoryHub } from "@/components/commerce/category-hub";
import { searchProducts } from "@/lib/commerce/provider";

export const metadata: Metadata = {
  title: "Pokemon Categories",
  description: "Pokemon slabs, singles, and sealed highlights from Slabhead.",
  alternates: {
    canonical: "/pokemon-categories",
  },
};

export default async function PokemonCategoriesPage() {
  const products = await searchProducts({ game: "pokemon" });

  return (
    <CategoryHub
      title="Pokemon Categories"
      description="From vintage slabs to modern chase cards, Slabhead keeps Pokemon listings clear, verified, and collector ready."
      image="/assets/legacy/categories/pokemon-slabbed.jpg"
      products={products}
    />
  );
}
