import prisma from "@/lib/db";
import { LandingTemplate } from "@/components/LandingTemplate";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";

export const revalidate = 600;

export const metadata = {
  title: "Firmy pro bankovní úvěry",
  description:
    "Hotové s.r.o. společnosti vhodné pro bankovní financování. Firmy s historií, aktivním obratem a vyšším základním kapitálem - ideální pro získání úvěru.",
  alternates: { canonical: "https://firmy.zajcon.cz/pro-uvery" },
  openGraph: {
    title: "Firmy pro bankovní úvěry | Zajcon Firmy",
    description:
      "S.r.o. firmy s historií a aktivním obratem pro snadné získání bankovního úvěru.",
    url: "https://firmy.zajcon.cz/pro-uvery",
  },
};

export default async function ProUveryPage() {
  const firmy = await prisma.firma
    .findMany({
      where: {
        published: true,
        status: { notIn: ["STAZENA", "PRODANA"] },
        OR: [
          { tags: { has: "Pro úvěry" } },
          { historieObratu: true, zakladniKapital: { gte: 200_000 } },
        ],
      },
      orderBy: [{ featured: "desc" }, { zakladniKapital: "desc" }],
    })
    .catch(() => []);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", url: "https://firmy.zajcon.cz/" },
          {
            name: "Firmy pro úvěry",
            url: "https://firmy.zajcon.cz/pro-uvery",
          },
        ])}
      />
      <LandingTemplate
        eyebrow="Pro bankovní úvěry"
        title={
          <>
            Firmy připravené
            <br />
            pro <span className="highlight">bankovní úvěr</span>
          </>
        }
        lead="Banky vyžadují historii, aktivní obrat a důvěryhodnost. Naše prověřené společnosti splňují všechna kritéria pro snadné získání úvěru – už od 1. dne po převzetí."
        benefits={[
          {
            title: "Aktivní obrat",
            desc: "Společnosti s reálnou historií tržeb v daňových přiznáních.",
          },
          {
            title: "Vyšší ZK",
            desc: "Základní kapitál od 200 000 Kč zvyšuje bonitu u banky.",
          },
          {
            title: "Bez závazků",
            desc: "Garance čistoty – žádné dluhy, spory ani exekuce.",
          },
          {
            title: "Stáří 5+ let",
            desc: "Banky preferují firmy s historií minimálně 2-3 roky.",
          },
        ]}
        firmy={firmy}
        emptyText="Aktuálně chystáme nové firmy pro úvěry. Ozvěte se nám pro custom nabídku."
        ctaTitle="Hledáte konkrétní parametry?"
        ctaDesc="Můžeme pro vás najít firmu na míru podle požadavků banky."
      />
    </>
  );
}
