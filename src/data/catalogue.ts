import type { Category, Product } from "@/lib/commerce/types";

export const categories: Category[] = [
  {
    slug: "pokemon-categories",
    name: "Pokemon",
    game: "pokemon",
    description: "Slabbed grails, singles, and sealed for serious collectors.",
    heroImage: "/assets/legacy/categories/pokemon.jpg",
  },
  {
    slug: "yu-gi-oh-categories",
    name: "Yu-Gi-Oh",
    game: "yugioh",
    description: "Classic and modern Yu-Gi-Oh slabs with collector-first verification.",
    heroImage: "/assets/legacy/categories/yugioh.jpg",
  },
  {
    slug: "magic-the-gathering-categories",
    name: "Magic: The Gathering",
    game: "mtg",
    description: "Reserved list icons and graded MTG highlights.",
    heroImage: "/assets/legacy/categories/mtg.jpg",
  },
];

export const products: Product[] = [
  {
    id: "codex-rayquaza-psa10",
    slug: "rayquaza-psa-10",
    name: "Rayquaza, PSA 10",
    description:
      "High-grade Rayquaza slab sourced for premium collectors. Case condition and centering checked.",
    game: "pokemon",
    category: "pokemon-slabbed",
    gradeCompany: "PSA",
    gradeScore: "10",
    offer: { price: 3700, currency: "ZAR", availability: "in_stock" },
    images: [
      {
        src: "/assets/legacy/products/rayquaza-psa-10/hero.jpg",
        alt: "Rayquaza PSA 10 slab",
      },
    ],
    tags: ["pokemon", "slab", "psa", "rayquaza"],
  },
  {
    id: "codex-vaporeon-vmax-psa9",
    slug: "vaporeon-vmax-psa-9",
    name: "Vaporeon VMAX, PSA 9",
    description: "Modern-era Vaporeon VMAX in PSA 9 slab with verified serial details.",
    game: "pokemon",
    category: "pokemon-slabbed",
    gradeCompany: "PSA",
    gradeScore: "9",
    offer: { price: 2400, currency: "ZAR", availability: "in_stock" },
    images: [
      {
        src: "/assets/legacy/products/vaporeon-vmax-psa-9/hero.jpg",
        alt: "Vaporeon VMAX PSA 9 slab",
      },
    ],
    tags: ["pokemon", "vaporeon", "vmax", "psa"],
  },
  {
    id: "codex-ghosts-from-the-past-2",
    slug: "ghosts-from-the-past-2",
    name: "Ghosts From The Past 2",
    description: "Collector-oriented Yu-Gi-Oh sealed product, listed with condition notes and stock status.",
    game: "yugioh",
    category: "yugioh-sealed",
    offer: { price: 375, currency: "ZAR", availability: "out_of_stock" },
    images: [
      {
        src: "/assets/legacy/products/ghosts-from-the-past-2/hero.jpg",
        alt: "Ghosts From The Past 2 sealed product",
      },
    ],
    tags: ["yugioh", "sealed", "booster"],
  },
  {
    id: "codex-zendikar-collector-booster",
    slug: "mtg-zendikar-rising-collector-booster",
    name: "MTG Zendikar Rising Collector Booster",
    description: "Premium MTG collector booster listing with transparent stock and pricing metadata.",
    game: "mtg",
    category: "mtg-sealed",
    offer: { price: 1100, currency: "ZAR", availability: "in_stock" },
    images: [
      {
        src: "/assets/legacy/products/mtg-zendikar-rising-collector-booster/hero.jpg",
        alt: "Zendikar Rising collector booster",
      },
    ],
    tags: ["mtg", "sealed", "collector-booster"],
  },
];
