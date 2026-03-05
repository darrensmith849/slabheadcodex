import type { Metadata } from "next";
import Link from "next/link";
import { Orbitron, Rajdhani } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const heading = Orbitron({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-heading",
});

const body = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${heading.variable} ${body.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-50 border-b border-white/10 bg-background/85 backdrop-blur">
            <nav className="flex items-center justify-between py-4">
              <Link href="/" className="font-heading text-xl uppercase tracking-[0.2em]">
                {siteConfig.siteName}
              </Link>
              <ul className="flex items-center gap-5 text-sm font-semibold tracking-wide text-muted-foreground">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition hover:text-foreground">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

          <main className="flex-1 py-8">{children}</main>

          <footer className="border-t border-white/10 py-6 text-sm text-muted-foreground">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p>
                {new Date().getFullYear()} {siteConfig.siteName}. Premium TCG marketplace.
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
      </body>
    </html>
  );
}
