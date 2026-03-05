import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; font-src 'self' data:; frame-ancestors 'none';",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/contact", destination: "/contact-us", permanent: true },
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/terms", destination: "/terms-of-service", permanent: true },
      { source: "/pokemon", destination: "/pokemon-categories", permanent: true },
      { source: "/yugioh", destination: "/yu-gi-oh-categories", permanent: true },
      { source: "/mtg", destination: "/magic-the-gathering-categories", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
