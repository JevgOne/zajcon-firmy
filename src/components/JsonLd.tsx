// Server komponenta pro vložení JSON-LD strukturovaných dat
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

const BASE_URL = "https://firmy.zajcon.cz";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "Zajcon Firmy",
    legalName: "Zajíček Consulting s.r.o.",
    url: BASE_URL,
    logo: `${BASE_URL}/icon.svg`,
    description:
      "Marketplace pro prodej a výkup českých s.r.o. společností. Hotové firmy s čistou historií k okamžitému převzetí.",
    taxID: "CZ07343957",
    vatID: "CZ07343957",
    identifier: "07343957",
    foundingDate: "2018-08-03",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Nové sady 988/2",
      addressLocality: "Brno",
      addressRegion: "Jihomoravský kraj",
      postalCode: "60200",
      addressCountry: "CZ",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+420-733-179-199",
      contactType: "sales",
      email: "firmy@zajcon.cz",
      areaServed: "CZ",
      availableLanguage: "Czech",
    },
    areaServed: {
      "@type": "Country",
      name: "Czech Republic",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "Zajcon Firmy",
    description: "Marketplace pro prodej a výkup s.r.o.",
    inLanguage: "cs-CZ",
    publisher: { "@id": `${BASE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/firmy?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

interface FirmaForSchema {
  id: string;
  ico: string;
  nazev: string;
  slug: string;
  cena: number;
  cenaDohodnout: boolean;
  status: string;
  popis: string | null;
  datumZalozeni: Date;
  zakladniKapital: number;
  sidloUlice: string;
  sidloMesto: string;
  sidloPsc: string;
}

export function firmaProductSchema(firma: FirmaForSchema) {
  const url = `${BASE_URL}/firmy/${firma.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: firma.nazev,
    sku: firma.ico,
    description:
      firma.popis ??
      `Hotová s.r.o. společnost ${firma.nazev}, IČO ${firma.ico}, založeno ${firma.datumZalozeni.getFullYear()}, základní kapitál ${firma.zakladniKapital.toLocaleString("cs-CZ")} Kč.`,
    url,
    brand: {
      "@type": "Brand",
      name: "Zajcon Firmy",
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "IČO",
        value: firma.ico,
      },
      {
        "@type": "PropertyValue",
        name: "Datum založení",
        value: firma.datumZalozeni.toISOString().split("T")[0],
      },
      {
        "@type": "PropertyValue",
        name: "Základní kapitál",
        value: `${firma.zakladniKapital} CZK`,
      },
      {
        "@type": "PropertyValue",
        name: "Sídlo",
        value: `${firma.sidloUlice}, ${firma.sidloPsc} ${firma.sidloMesto}`,
      },
    ],
    offers: firma.cenaDohodnout
      ? {
          "@type": "Offer",
          url,
          priceCurrency: "CZK",
          availability:
            firma.status === "VOLNA"
              ? "https://schema.org/InStock"
              : firma.status === "REZERVOVANA"
                ? "https://schema.org/PreOrder"
                : "https://schema.org/SoldOut",
          seller: { "@id": `${BASE_URL}/#organization` },
        }
      : {
          "@type": "Offer",
          url,
          price: firma.cena,
          priceCurrency: "CZK",
          availability:
            firma.status === "VOLNA"
              ? "https://schema.org/InStock"
              : firma.status === "REZERVOVANA"
                ? "https://schema.org/PreOrder"
                : "https://schema.org/SoldOut",
          seller: { "@id": `${BASE_URL}/#organization` },
        },
  };
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}
