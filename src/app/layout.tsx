import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://firmy.zajcon.cz"),
  title: {
    default: "Zajcon Firmy | Prodej a výkup společností s.r.o.",
    template: "%s | Zajcon Firmy",
  },
  description:
    "Prověřené společnosti s čistou historií. Hotové firmy k okamžitému převzetí pro bankovní úvěry, veřejné zakázky nebo rychlý start podnikání.",
  openGraph: {
    title: "Zajcon Firmy | Prodej a výkup společností s.r.o.",
    description:
      "Prověřené společnosti s čistou historií. Hotové firmy k okamžitému převzetí.",
    type: "website",
    locale: "cs_CZ",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
