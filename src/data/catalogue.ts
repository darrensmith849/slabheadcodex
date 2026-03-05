import type { Category, Product } from "@/lib/commerce/types";

export const categories: Category[] = [
  {
    slug: "pokemon-categories",
    name: "Pokemon",
    game: "pokemon",
    description: "Slabbed grails, singles, and sealed for serious collectors.",
    heroImage: "/assets/legacy/categories/pokemon-slabbed.jpg",
  },
  {
    slug: "yu-gi-oh-categories",
    name: "Yu-Gi-Oh",
    game: "yugioh",
    description: "Classic and modern Yu-Gi-Oh slabs with collector-first verification.",
    heroImage: "/assets/legacy/brand/yugioh-sealed.jpg",
  },
  {
    slug: "magic-the-gathering-categories",
    name: "Magic: The Gathering",
    game: "mtg",
    description: "Reserved list icons and graded MTG highlights.",
    heroImage: "/assets/legacy/categories/magic-the-gathering-card-swords-to-plowshares4.jpg",
  },
];

export const products: Product[] = [
  {
    id: "codex-dark-charizard-cgc8-5",
    slug: "dark-charizard-cgc-8-5",
    name: "Dark Charizard, CGC 8.5",
    description:
      "High-grade Dark Charizard slab sourced for premium collectors. Case condition and centering checked.",
    game: "pokemon",
    category: "pokemon-slabbed",
    gradeCompany: "CGC",
    gradeScore: "8.5",
    offer: { price: 3700, currency: "ZAR", availability: "in_stock" },
    images: [
      {
        src: "/assets/legacy/products/dark-charizard-cgc-blue-8-5-jpn-scaled.png",
        alt: "Dark Charizard CGC 8.5 slab",
      },
    ],
    tags: ["pokemon", "slab", "cgc", "charizard"],
  },
  {
    id: "codex-vaporeon-vivid-psa9-2",
    slug: "vaporeon-psa-9",
    name: "Vaporeon, PSA 9",
    description: "Classic Vaporeon slab with verified serial details and collector-grade presentation.",
    game: "pokemon",
    category: "pokemon-slabbed",
    gradeCompany: "PSA",
    gradeScore: "9",
    offer: { price: 2400, currency: "ZAR", availability: "in_stock" },
    images: [
      {
        src: "/assets/legacy/products/vaporeon-vivid-psa-9-2-scaled.png",
        alt: "Vaporeon PSA 9 slab",
      },
    ],
    tags: ["pokemon", "vaporeon", "psa"],
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
        src: "/assets/legacy/brand/yugioh-sealed.jpg",
        alt: "Ghosts From The Past 2 sealed product",
      },
    ],
    tags: ["yugioh", "sealed", "booster"],
  },
  {
    id: "codex-slaking-psa9",
    slug: "slaking-psa-9",
    name: "Slaking, PSA 9",
    description: "A slabbed Pokemon listing with transparent stock and pricing metadata.",
    game: "pokemon",
    category: "pokemon-slabbed",
    gradeCompany: "PSA",
    gradeScore: "9",
    offer: { price: 1100, currency: "ZAR", availability: "in_stock" },
    images: [
      {
        src: "/assets/legacy/products/slaking-psa-9-scaled.png",
        alt: "Slaking PSA 9 slab",
      },
    ],
    tags: ["pokemon", "slab", "psa"],
  },
];
