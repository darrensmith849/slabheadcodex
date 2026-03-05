export const siteConfig = {
  siteName: "Slabhead",
  legalName: "Slabhead",
  siteTagline: "Your ultimate source for rare Pokémon cards & collector items",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://slabhead.co.za",
  description:
    "Slabhead is your ultimate source for rare Pokémon cards, Japanese exclusives, and collector services in South Africa.",
  currency: "ZAR",
  contact: {
    email: "info@slabhead.co.za",
    phone: "+27 00 000 0000",
  },
  primaryEmail: "info@slabhead.co.za",
  hours: {
    weekday: "Mon–Fri: 10:00–20:00",
    saturday: "Sat: 10:00–16:00",
    sunday: "Sun: 10:00–18:00",
    openingHours: ["Mo-Fr 10:00-20:00", "Sa 10:00-16:00", "Su 10:00-18:00"],
  },
  socials: {
    instagram: "https://instagram.com/slabhead_collectables",
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
