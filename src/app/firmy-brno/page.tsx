import prisma from "@/lib/db";
import { LandingTemplate } from "@/components/LandingTemplate";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";

export const revalidate = 600;

export const metadata = {
  title: "Prodej s.r.o. firem v Brně",
  description:
    "Hotové společnosti s.r.o. se sídlem v Brně k okamžitému převzetí. Ready-made firmy, společnosti s historií, plátci DPH - kompletní servis převodu.",
  alternates: { canonical: "https://firmy.zajcon.cz/firmy-brno" },
  openGraph: {
    title: "Hotové firmy v Brně | Zajcon Firmy",
    description: "S.r.o. společnosti se sídlem v Brně k okamžitému převzetí.",
    url: "https://firmy.zajcon.cz/firmy-brno",
  },
};

export default async function FirmyBrnoPage() {
  const firmy = await prisma.firma
    .findMany({
      where: {
        published: true,
        status: { notIn: ["STAZENA", "PRODANA"] },
        sidloMesto: { contains: "Brno", mode: "insensitive" },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    })
    .catch(() => []);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", url: "https://firmy.zajcon.cz/" },
          { name: "Firmy v Brně", url: "https://firmy.zajcon.cz/firmy-brno" },
        ])}
      />
      <LandingTemplate
        eyebrow="Sídlo Brno"
        title={
          <>
            Hotové s.r.o. firmy
            <br />
            se sídlem v <span className="highlight">Brně</span>
          </>
        }
        lead="My sami sídlíme v Brně, takže máme nejlepší přehled o místních firmách. Pokud hledáte společnost s brněnským sídlem – ať už pro lokální podnikání, blízkost k jihomoravským klientům nebo jen praktičnost při papírování – jste tu správně."
        benefits={[
          {
            title: "Lokální tým",
            desc: "Sídlíme v Brně, vyřízení převodu osobně bez cestování.",
          },
          {
            title: "Notář v Brně",
            desc: "Spolupracujeme s prověřenými notáři v centru Brna.",
          },
          {
            title: "Jihomoravské firmy",
            desc: "Společnosti registrované v Brně i okolí – Brno-město i Brno-venkov.",
          },
          {
            title: "Garance čistoty",
            desc: "Každá firma prověřena, písemná garance bezdluhovosti.",
          },
        ]}
        firmy={firmy}
        emptyText="Aktuálně nemáme volné firmy v Brně. Připravíme novou na míru – ozvěte se."
        ctaTitle="Potřebujete sídlo v jiném městě?"
        ctaDesc="Převod sídla na vaši adresu zařídíme za 4 999 Kč na klíč."
      />
    </>
  );
}
