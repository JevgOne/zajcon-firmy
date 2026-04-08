import prisma from "@/lib/db";
import { LandingTemplate } from "@/components/LandingTemplate";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";

export const revalidate = 600;

export const metadata = {
  title: "Ready-made firmy s.r.o. - okamžité založení",
  description:
    "Nově založené prázdné s.r.o. společnosti k okamžitému převzetí. Bez historie, bez závazků, plně připravené k zápisu nového jednatele - od 25 000 Kč.",
  alternates: { canonical: "https://firmy.zajcon.cz/ready-made" },
  openGraph: {
    title: "Ready-made s.r.o. | Zajcon Firmy",
    description:
      "Nově založené prázdné s.r.o. k okamžitému převzetí - od 25 000 Kč.",
    url: "https://firmy.zajcon.cz/ready-made",
  },
};

export default async function ReadyMadePage() {
  const firmy = await prisma.firma
    .findMany({
      where: {
        published: true,
        status: { notIn: ["STAZENA", "PRODANA"] },
        OR: [
          { tags: { has: "Ready-made" } },
          {
            historieObratu: false,
            datumZalozeni: {
              gte: new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000),
            },
          },
        ],
      },
      orderBy: [{ featured: "desc" }, { cena: "asc" }],
    })
    .catch(() => []);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", url: "https://firmy.zajcon.cz/" },
          {
            name: "Ready-made firmy",
            url: "https://firmy.zajcon.cz/ready-made",
          },
        ])}
      />
      <LandingTemplate
        eyebrow="Ready-made"
        title={
          <>
            Ready-made firmy
            <br />k <span className="highlight">okamžitému</span> zápisu
          </>
        }
        lead="Nově založené prázdné s.r.o. společnosti bez historie, bez závazků a bez čekání na zápis do OR. Stačí podepsat smlouvu u notáře a hned podnikáte. Ideální pro start podnikání nebo druhou firmu."
        benefits={[
          {
            title: "Bez historie",
            desc: "Žádné staré účetnictví, žádné překvapení – čistý štít.",
          },
          {
            title: "Okamžité podnikání",
            desc: "Můžete fakturovat hned po podpisu smlouvy u notáře.",
          },
          {
            title: "Levnější než nová",
            desc: "Cena včetně všech poplatků a notáře. Žádné měsíce čekání.",
          },
          {
            title: "Garance čistoty",
            desc: "Písemná garance, že firma nemá závazky vůči FÚ ani jiným institucím.",
          },
        ]}
        firmy={firmy}
        emptyText="Aktuálně doplňujeme nové ready-made firmy. Ozvěte se pro nabídku."
        ctaTitle="Potřebujete více ready-made firem?"
        ctaDesc="Zakládáme nové společnosti pravidelně. Můžeme připravit i custom variantu."
      />
    </>
  );
}
