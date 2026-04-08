import prisma from "@/lib/db";
import { LandingTemplate } from "@/components/LandingTemplate";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";

export const revalidate = 600;

export const metadata = {
  title: "Prodej s.r.o. firem v Praze",
  description:
    "Hotové společnosti s.r.o. se sídlem v Praze k okamžitému převzetí. Firmy s historií, ready-made i premium pro úvěry. Praha 1, 2, 3, 5, 8, 10.",
  alternates: { canonical: "https://firmy.zajcon.cz/firmy-praha" },
  openGraph: {
    title: "Hotové firmy v Praze | Zajcon Firmy",
    description: "S.r.o. společnosti se sídlem v Praze k okamžitému převzetí.",
    url: "https://firmy.zajcon.cz/firmy-praha",
  },
};

export default async function FirmyPrahaPage() {
  const firmy = await prisma.firma
    .findMany({
      where: {
        published: true,
        status: { notIn: ["STAZENA", "PRODANA"] },
        sidloMesto: { contains: "Praha", mode: "insensitive" },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    })
    .catch(() => []);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", url: "https://firmy.zajcon.cz/" },
          {
            name: "Firmy v Praze",
            url: "https://firmy.zajcon.cz/firmy-praha",
          },
        ])}
      />
      <LandingTemplate
        eyebrow="Sídlo Praha"
        title={
          <>
            Hotové s.r.o. firmy
            <br />
            se sídlem v <span className="highlight">Praze</span>
          </>
        }
        lead="Společnosti registrované v Praze – ideální pro klienty, kteří hledají prestižní pražskou adresu, nebo firmy s historií podnikání v hlavním městě. Pokud chcete sídlo přesunout jinam, vyřídíme i převod sídla."
        benefits={[
          {
            title: "Pražská adresa",
            desc: "Prestiž a důvěryhodnost pro obchodní partnery i banky.",
          },
          {
            title: "Praha 1–10",
            desc: "Firmy z různých městských částí podle vašich preferencí.",
          },
          {
            title: "Snadný převod sídla",
            desc: "Když chcete jinam, převod sídla zařídíme za 4 999 Kč.",
          },
          {
            title: "Garance čistoty",
            desc: "Každá firma prověřena, písemná garance bezdluhovosti.",
          },
        ]}
        firmy={firmy}
        emptyText="Aktuálně nemáme volné firmy v Praze. Můžeme firmu připravit na míru – ozvěte se."
        ctaTitle="Hledáte konkrétní městskou část?"
        ctaDesc="Praha 1, 2, 5, 8 nebo jiná – řekněte, co potřebujete."
      />
    </>
  );
}
