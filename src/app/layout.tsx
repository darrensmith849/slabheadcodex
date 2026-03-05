import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { NeonAuroraBackground } from "@/components/visual/NeonAuroraBackground";
import { siteConfig } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.siteName} | ${siteConfig.siteTagline}`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.siteName,
  openGraph: {
    type: "website",
    siteName: siteConfig.siteName,
    title: `${siteConfig.siteName} | ${siteConfig.siteTagline}`,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.siteName} | ${siteConfig.siteTagline}`,
    description: siteConfig.description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "/";

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: siteConfig.siteUrl,
    email: siteConfig.primaryEmail,
    openingHours: siteConfig.hours.openingHours,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: siteConfig.primaryEmail,
    },
    sameAs: [siteConfig.socials.instagram],
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="relative isolate min-h-screen overflow-x-clip">
          <NeonAuroraBackground pathname={pathname} />
          <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-50 mt-2 rounded-xl border border-[#89a0ff]/30 bg-[linear-gradient(135deg,rgba(12,19,36,0.86),rgba(16,24,43,0.8))] shadow-[0_0_0_1px_rgba(120,148,255,0.24),0_18px_44px_rgba(4,10,26,0.45)] backdrop-blur-md">
            <nav className="flex items-center justify-between px-3 py-3 sm:px-4">
              <Link
                href="/"
                className="inline-flex min-h-11 items-center rounded-lg border border-[#93a6ff]/35 bg-[linear-gradient(135deg,rgba(74,96,255,0.2),rgba(236,109,255,0.16))] px-5 py-2.5 font-heading text-base uppercase tracking-[0.18em] leading-[1.1] text-[#f6f8ff] shadow-[0_0_18px_rgba(120,146,255,0.24)]"
              >
                SLABHEAD
              </Link>
              <ul className="flex items-center gap-5 text-sm font-semibold tracking-[0.08em] text-muted-foreground">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="rounded-md px-2 py-1 text-[#c4d2f5] transition hover:bg-white/6 hover:text-[#f1f5ff]">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

          <main className="flex-1 py-10">{children}</main>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationJsonLd),
            }}
          />

          <footer className="border-t border-white/10 py-6 text-sm text-muted-foreground">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>
                {new Date().getFullYear()} {siteConfig.siteName}. Rare Pokémon cards and collector services in South Africa.
              </p>
              <div className="flex gap-4">
                <Link href="/privacy-policy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </div>
            </div>
          </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
