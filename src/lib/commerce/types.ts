export type Offer = {
  price: number;
  currency: "ZAR";
  availability: "in_stock" | "out_of_stock" | "preorder";
};

export type ProductImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  game: "pokemon" | "yugioh" | "mtg" | "other";
  category: string;
  gradeCompany?: string;
  gradeScore?: string;
  offer: Offer;
  images: ProductImage[];
  tags: string[];
};

export type Category = {
  slug: string;
  name: string;
  game: Product["game"];
  description: string;
  heroImage: string;
};

export type SearchFilters = {
  query?: string;
  category?: string;
  game?: Product["game"];
  gradeCompany?: string;
  gradeScore?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: Offer["availability"];
};

export type CommerceProvider = {
  getProductBySlug: (slug: string) => Promise<Product | null>;
  listProducts: () => Promise<Product[]>;
  searchProducts: (filters?: SearchFilters) => Promise<Product[]>;
  listCategories: () => Promise<Category[]>;
};
