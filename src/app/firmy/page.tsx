import Link from "next/link";
import prisma from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FirmaCard } from "@/components/FirmaCard";

export const revalidate = 300;

export const metadata = {
  title: "Nabídka firem",
  description: "Kompletní katalog hotových společností s.r.o. k převzetí.",
};

export default async function FirmyPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; tag?: string }>;
}) {
  const { tag } = await searchParams;

  const firmy = await prisma.firma
    .findMany({
      where: {
        published: true,
        status: { notIn: ["STAZENA"] },
        ...(tag ? { tags: { has: tag } } : {}),
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    })
    .catch(() => []);

  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 min-h-screen">
        <div className="container-max">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-10 h-px bg-accent"></span>
              <span className="text-xs font-medium uppercase tracking-widest text-accent">
                Katalog
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              Nabídka firem
            </h1>
            <p className="text-lg text-slate max-w-2xl">
              {firmy.length === 0
                ? "Zrovna nemáme volné firmy. Brzy přibydou nové."
                : `${firmy.length} prověřených ${plural(firmy.length, "společnost", "společnosti", "společností")} k okamžitému převzetí.`}
            </p>
          </div>

          {firmy.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {firmy.map((firma, i) => (
                <FirmaCard
                  key={firma.id}
                  firma={firma}
                  featured={i === 0 && firma.featured}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CTA banner: Chcete prodat firmu? */}
      <section className="py-20 bg-black text-white">
        <div className="container-max max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block w-10 h-px bg-accent"></span>
            <span className="text-xs font-medium uppercase tracking-widest text-accent">
              Výkup s.r.o.
            </span>
            <span className="block w-10 h-px bg-accent"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 text-white">
            Nenašli jste, co hledáte?
            <br />
            Nebo chcete <span className="highlight">prodat</span> svoji firmu?
          </h2>
          <p className="text-silver text-lg mb-8 max-w-xl mx-auto">
            Vykupujeme s.r.o. společnosti rychle a diskrétně. Nezávazná nabídka
            do 24 hodin.
          </p>
          <Link href="/prodat" className="btn btn-accent">
            Získat nezávaznou nabídku
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return few;
  return many;
}
