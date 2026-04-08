import prisma from "@/lib/db";
import { LandingTemplate } from "@/components/LandingTemplate";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";

export const revalidate = 600;

export const metadata = {
  title: "Firmy pro veřejné zakázky a tendry",
  description:
    "S.r.o. společnosti vhodné pro účast ve veřejných zakázkách. Firmy s referencemi, historií a kvalifikací splňují požadavky zadavatelů tendrů.",
  alternates: { canonical: "https://firmy.zajcon.cz/pro-tendry" },
  openGraph: {
    title: "Firmy pro veřejné zakázky | Zajcon Firmy",
    description:
      "Hotové s.r.o. s historií a referencemi pro účast ve veřejných zakázkách.",
    url: "https://firmy.zajcon.cz/pro-tendry",
  },
};

export default async function ProTendryPage() {
  const firmy = await prisma.firma
    .findMany({
      where: {
        published: true,
        status: { notIn: ["STAZENA", "PRODANA"] },
        OR: [
          { tags: { has: "Pro tendry" } },
          { tags: { has: "Reference" } },
          { historieObratu: true },
        ],
      },
      orderBy: [{ featured: "desc" }, { datumZalozeni: "asc" }],
    })
    .catch(() => []);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", url: "https://firmy.zajcon.cz/" },
          {
            name: "Firmy pro tendry",
            url: "https://firmy.zajcon.cz/pro-tendry",
          },
        ])}
      />
      <LandingTemplate
        eyebrow="Pro veřejné zakázky"
        title={
          <>
            Firmy s historií
            <br />
            pro <span className="highlight">veřejné zakázky</span>
          </>
        }
        lead="Zadavatelé veřejných zakázek vyžadují prokázání kvalifikace, referencí a historie. Naše firmy mají vše potřebné k okamžité účasti v tendru – stačí převzít a soutěžit."
        benefits={[
          {
            title: "Reference",
            desc: "Společnosti s historií zakázek v daňových přiznáních.",
          },
          {
            title: "Stáří 5+ let",
            desc: "Většina tendrů vyžaduje minimální historii podnikání.",
          },
          {
            title: "Plátce DPH",
            desc: "Většina veřejných zakázek vyžaduje DIČ a plátcovství DPH.",
          },
          {
            title: "Čistá historie",
            desc: "Bez dluhů na FÚ, ČSSZ a ZP – jinak diskvalifikace v tendru.",
          },
        ]}
        firmy={firmy}
        emptyText="Aktuálně chystáme nové firmy pro tendry. Ozvěte se nám pro custom nabídku."
        ctaTitle="Potřebujete konkrétní obor činnosti?"
        ctaDesc="Pro veřejné zakázky často záleží na CZ-NACE kódech. Najdeme firmu na míru."
      />
    </>
  );
}
