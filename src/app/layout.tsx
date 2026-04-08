import type { Metadata } from "next";
import "./globals.css";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL("https://firmy.zajcon.cz"),
  title: {
    default: "Zajcon Firmy | Prodej a výkup společností s.r.o.",
    template: "%s | Zajcon Firmy",
  },
  description:
    "Prověřené společnosti s čistou historií. Hotové s.r.o. firmy k okamžitému převzetí pro bankovní úvěry, veřejné zakázky nebo rychlý start podnikání. Výkup do 24 hodin.",
  keywords: [
    "prodej s.r.o.",
    "výkup s.r.o.",
    "hotová firma",
    "ready-made firma",
    "koupit s.r.o.",
    "prodat firmu",
    "společnost s historií",
    "firma pro úvěr",
    "firma pro tendr",
    "Zajcon Firmy",
  ],
  openGraph: {
    title: "Zajcon Firmy | Prodej a výkup společností s.r.o.",
    description:
      "Prověřené společnosti s čistou historií. Hotové firmy k okamžitému převzetí.",
    type: "website",
    locale: "cs_CZ",
    siteName: "Zajcon Firmy",
    url: "https://firmy.zajcon.cz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zajcon Firmy | Prodej a výkup s.r.o.",
    description:
      "Prověřené hotové firmy k okamžitému převzetí. Výkup s.r.o. do 24 hodin.",
  },
  alternates: {
    canonical: "https://firmy.zajcon.cz",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: { url: "/apple-icon.svg", type: "image/svg+xml" },
    shortcut: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs">
      <body className="min-h-screen flex flex-col">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        {children}
      </body>
    </html>
  );
}
