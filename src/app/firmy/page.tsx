import Link from "next/link";
import prisma from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FirmaCard } from "@/components/FirmaCard";

export const revalidate = 300;

export const metadata = {
  title: "Nabídka firem",
  description: "Kompletní katalog hotových společností s.r.o. k převzetí.",
};

type Filter = "vse" | "volne" | "rezervovane" | "prodane" | "ready-made" | "s-historii" | "platce-dph";
type Sort = "nejnovejsi" | "nejlevnejsi" | "nejdrazsi" | "nejstarsi" | "nejmladsi";

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: "vse", label: "Vše" },
  { key: "volne", label: "Volné" },
  { key: "rezervovane", label: "Rezervované" },
  { key: "ready-made", label: "Ready-made" },
  { key: "s-historii", label: "S historií" },
  { key: "platce-dph", label: "Plátce DPH" },
  { key: "prodane", label: "Prodané" },
];

const SORTS: Array<{ key: Sort; label: string }> = [
  { key: "nejnovejsi", label: "Nejnovější v nabídce" },
  { key: "nejlevnejsi", label: "Cena: od nejnižší" },
  { key: "nejdrazsi", label: "Cena: od nejvyšší" },
  { key: "nejstarsi", label: "Stáří firmy: nejstarší" },
  { key: "nejmladsi", label: "Stáří firmy: nejmladší" },
];

export default async function FirmyPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const filter = (params.filter ?? "vse") as Filter;
  const sort = (params.sort ?? "nejnovejsi") as Sort;

  const where: Prisma.FirmaWhereInput = {
    published: true,
    status: { notIn: ["STAZENA"] },
  };

  switch (filter) {
    case "volne":
      where.status = "VOLNA";
      break;
    case "rezervovane":
      where.status = "REZERVOVANA";
      break;
    case "prodane":
      where.status = "PRODANA";
      break;
    case "ready-made":
      where.OR = [
        { tags: { has: "Ready-made" } },
        { historieObratu: false },
      ];
      break;
    case "s-historii":
      where.historieObratu = true;
      break;
    case "platce-dph":
      where.platceDph = true;
      break;
  }

  const orderBy: Prisma.FirmaOrderByWithRelationInput[] = [];
  switch (sort) {
    case "nejlevnejsi":
      orderBy.push({ cena: "asc" });
      break;
    case "nejdrazsi":
      orderBy.push({ cena: "desc" });
      break;
    case "nejstarsi":
      orderBy.push({ datumZalozeni: "asc" });
      break;
    case "nejmladsi":
      orderBy.push({ datumZalozeni: "desc" });
      break;
    default:
      orderBy.push({ featured: "desc" }, { createdAt: "desc" });
  }

  const [firmy, totalAll, totalVolne, totalRezervovane, totalProdane, totalReadyMade, totalSHistorii, totalDph] =
    await Promise.all([
      prisma.firma.findMany({ where, orderBy }).catch(() => []),
      prisma.firma.count({ where: { published: true, status: { notIn: ["STAZENA"] } } }).catch(() => 0),
      prisma.firma.count({ where: { published: true, status: "VOLNA" } }).catch(() => 0),
      prisma.firma.count({ where: { published: true, status: "REZERVOVANA" } }).catch(() => 0),
      prisma.firma.count({ where: { published: true, status: "PRODANA" } }).catch(() => 0),
      prisma.firma.count({ where: { published: true, status: { notIn: ["STAZENA"] }, historieObratu: false } }).catch(() => 0),
      prisma.firma.count({ where: { published: true, status: { notIn: ["STAZENA"] }, historieObratu: true } }).catch(() => 0),
      prisma.firma.count({ where: { published: true, status: { notIn: ["STAZENA"] }, platceDph: true } }).catch(() => 0),
    ]);

  const filterCounts: Record<Filter, number> = {
    vse: totalAll,
    volne: totalVolne,
    rezervovane: totalRezervovane,
    prodane: totalProdane,
    "ready-made": totalReadyMade,
    "s-historii": totalSHistorii,
    "platce-dph": totalDph,
  };

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative pt-40 pb-12 overflow-hidden border-b border-pearl bg-cloud">
        <div className="absolute inset-0 -z-10 hero-grid opacity-50"></div>
        <div
          className="absolute -top-1/2 -right-1/4 w-[60%] h-[120%] rounded-full opacity-50 blur-3xl -z-10"
          style={{
            background:
              "radial-gradient(ellipse, rgba(184,150,90,0.18) 0%, transparent 60%)",
          }}
        />

        <div className="container-max">
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-10 h-px bg-accent"></span>
            <span className="text-xs font-medium uppercase tracking-widest text-accent">
              Katalog
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <h1 className="text-5xl md:text-7xl font-black mb-4 leading-[1.05]">
                Firmy k <span className="highlight">převzetí</span>
              </h1>
              <p className="text-lg text-slate max-w-xl">
                {totalAll} prověřených{" "}
                {plural(totalAll, "společnost", "společnosti", "společností")} s
                čistou historií. Garance bezdluhovosti, převod do 5 dnů.
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              <KpiPill value={totalVolne} label="Volných" tone="green" />
              <KpiPill value={totalRezervovane} label="Rezervovaných" tone="amber" />
              <KpiPill value={totalDph} label="Plátců DPH" tone="accent" />
            </div>
          </div>
        </div>
      </section>

      {/* FILTRY + SORT */}
      <section className="sticky top-[68px] z-30 bg-white/90 backdrop-blur-md border-b border-pearl">
        <div className="container-max py-4 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2 flex-1 overflow-x-auto">
            {FILTERS.map((f) => {
              const isActive = filter === f.key;
              const count = filterCounts[f.key];
              if (count === 0 && f.key !== "vse") return null;
              return (
                <Link
                  key={f.key}
                  href={`/firmy${f.key === "vse" ? "" : `?filter=${f.key}`}${sort !== "nejnovejsi" ? `${f.key === "vse" ? "?" : "&"}sort=${sort}` : ""}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-black text-white border border-black"
                      : "bg-white text-graphite border border-pearl hover:border-accent"
                  }`}
                >
                  {f.label}
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-cloud text-slate"
                    }`}
                  >
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs uppercase tracking-wider text-slate">
              Seřadit:
            </span>
            <div className="flex flex-wrap gap-1">
              {SORTS.map((s) => {
                const isActive = sort === s.key;
                return (
                  <Link
                    key={s.key}
                    href={`/firmy?${filter !== "vse" ? `filter=${filter}&` : ""}sort=${s.key}`}
                    className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                      isActive
                        ? "bg-accent text-white"
                        : "text-slate hover:text-black hover:bg-cloud"
                    }`}
                  >
                    {s.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* GRID FIREM */}
      <main className="py-16 min-h-[60vh]">
        <div className="container-max">
          {firmy.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cloud border border-pearl mb-6">
                <svg
                  className="w-9 h-9 text-slate"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3">Žádné firmy v této kategorii</h2>
              <p className="text-slate mb-8">
                Zkuste jiný filtr nebo nás kontaktujte přímo – najdeme vám firmu na míru.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/firmy" className="btn btn-secondary">
                  Zobrazit všechny
                </Link>
                <a href="tel:+420733179199" className="btn btn-primary">
                  Zavolat nám
                </a>
              </div>
            </div>
          ) : (
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
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/prodat" className="btn btn-accent">
              Získat nezávaznou nabídku
            </Link>
            <a href="tel:+420733179199" className="btn btn-secondary !text-white !border-graphite hover:!border-accent">
              +420 733 179 199
            </a>
          </div>
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

function KpiPill({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "green" | "amber" | "accent";
}) {
  const toneClass = {
    green: "text-available",
    amber: "text-reserved",
    accent: "text-accent",
  }[tone];
  return (
    <div className="flex items-baseline gap-2">
      <span className={`text-3xl font-black ${toneClass}`}>{value}</span>
      <span className="text-xs uppercase tracking-wider text-slate">{label}</span>
    </div>
  );
}
