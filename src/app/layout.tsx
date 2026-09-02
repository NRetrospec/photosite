import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope, IBM_Plex_Mono } from "next/font/google";
import { ShutterProvider } from "@/components/shutter/ShutterProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";
import { heroPhoto } from "@/lib/photos";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-var",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.specialties.join(", ")} Photographer in ${site.location}`,
    template: `%s — ${site.studio}`,
  },
  description: `${site.intro} Based in ${site.location}. ${site.travel}.`,
  keywords: [
    site.name,
    `photographer ${site.location}`,
    ...site.specialties.map((s) => `${s.toLowerCase()} photographer`),
  ],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.intro,
    url: site.url,
    siteName: site.studio,
    images: [{ url: heroPhoto.src, width: 1600, height: 1067, alt: heroPhoto.alt }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.intro,
    images: [heroPhoto.src],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.studio,
  description: site.intro,
  url: site.url,
  email: site.email,
  telephone: site.phone,
  founder: { "@type": "Person", name: site.name, jobTitle: "Photographer" },
  address: { "@type": "PostalAddress", addressLocality: site.location },
  areaServed: "Worldwide",
  sameAs: Object.values(site.social),
  knowsAbout: site.specialties,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} ${plexMono.variable}`}>
      <body className="grain bg-ink text-cream antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ShutterProvider>
          <Nav />
          <main id="content">{children}</main>
          <Footer />
        </ShutterProvider>
      </body>
    </html>
  );
}
