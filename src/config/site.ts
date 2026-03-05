export const siteConfig = {
  siteName: "Codex",
  siteTagline: "Premium TCG Marketplace",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://codex.example.com",
  description:
    "Codex is a premium marketplace for graded Pokemon, Yu-Gi-Oh, and MTG cards in South Africa.",
  contact: {
    email: "support@codex.example.com",
    phone: "+27 00 000 0000",
  },
  socials: {
    instagram: "https://instagram.com/codex",
    x: "https://x.com/codex",
  },
  nav: [
    { label: "Shop", href: "/shop" },
    { label: "Collectables", href: "/collectables" },
    { label: "Services", href: "/services-categories" },
    { label: "Culture", href: "/culture" },
    { label: "About", href: "/about-us" },
    { label: "Contact", href: "/contact-us" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
