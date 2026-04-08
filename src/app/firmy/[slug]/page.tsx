import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NakupForm } from "@/components/NakupForm";
import {
  JsonLd,
  firmaProductSchema,
  breadcrumbSchema,
} from "@/components/JsonLd";
import { formatCurrency } from "@/lib/pricing";
import { calculateAge } from "@/lib/ares";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  // Pre-generujeme published firmy při buildu pro nejrychlejší TTFB
  const firmy = await prisma.firma
    .findMany({
      where: { published: true, status: { not: "PRODANA" } },
      select: { slug: true },
    })
    .catch(() => []);
  return firmy.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const firma = await prisma.firma.findUnique({ where: { slug } }).catch(() => null);
  if (!firma) return { title: "Firma nenalezena" };
  const title = firma.metaTitle ?? firma.nazev;
  const description =
    firma.metaDescription ??
    `${firma.nazev} - hotová firma s.r.o. k převzetí. IČO ${firma.ico}, založeno ${firma.datumZalozeni.getFullYear()}, základní kapitál ${formatCurrency(firma.zakladniKapital)}. Cena ${firma.cenaDohodnout ? "dohodou" : formatCurrency(firma.cena)}.`;
  return {
    title,
    description,
    alternates: { canonical: `https://firmy.zajcon.cz/firmy/${firma.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://firmy.zajcon.cz/firmy/${firma.slug}`,
    },
  };
}

export default async function FirmaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const firma = await prisma.firma.findUnique({ where: { slug } });
  if (!firma || !firma.published) notFound();

  const age = calculateAge(firma.datumZalozeni);

  return (
    <>
      <JsonLd
        data={[
          firmaProductSchema(firma),
          breadcrumbSchema([
            { name: "Domů", url: "https://firmy.zajcon.cz/" },
            { name: "Nabídka firem", url: "https://firmy.zajcon.cz/firmy" },
            {
              name: firma.nazev,
              url: `https://firmy.zajcon.cz/firmy/${firma.slug}`,
            },
          ]),
        ]}
      />
      <Navbar />

      <main className="pt-32 min-h-screen">
        <div className="container-max max-w-5xl">
          <Link
            href="/firmy"
            className="inline-flex items-center gap-2 text-sm text-slate hover:text-black mb-8 transition-colors"
          >
            ← Zpět na nabídku
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <span className="text-xs font-medium uppercase tracking-widest text-accent">
                IČO {firma.ico}
              </span>
              <h1 className="text-4xl md:text-5xl font-black mt-2 mb-4">
                {firma.nazev}
              </h1>

              <div className="flex flex-wrap gap-2 mb-8">
                <span className="tag">
                  {age > 0
                    ? `${age} ${age === 1 ? "rok" : age <= 4 ? "roky" : "let"}`
                    : "Ready-made"}
                </span>
                {firma.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>

              {firma.popis && (
                <div className="prose max-w-none text-graphite leading-relaxed mb-10">
                  <p>{firma.popis}</p>
                </div>
              )}

              <div className="border-t border-pearl pt-8">
                <h2 className="text-xl font-bold mb-6">Klíčové údaje</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                  <DetailRow label="Datum založení" value={formatDate(firma.datumZalozeni)} />
                  <DetailRow label="Stáří" value={`${age} let`} />
                  <DetailRow
                    label="Základní kapitál"
                    value={formatCurrency(firma.zakladniKapital)}
                  />
                  <DetailRow
                    label="Plátce DPH"
                    value={firma.platceDph ? "Ano" : "Ne"}
                  />
                  <DetailRow
                    label="Datová schránka"
                    value={firma.datovaSchranka ? "Ano" : "Ne"}
                  />
                  <DetailRow
                    label="Aktivní obrat"
                    value={firma.historieObratu ? "Ano" : "Ne"}
                  />
                  <DetailRow
                    label="Sídlo"
                    value={`${firma.sidloUlice}, ${firma.sidloPsc} ${firma.sidloMesto}`}
                    full
                  />
                </dl>
              </div>
            </div>

            {/* Sticky pricing card */}
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="bg-cloud border border-pearl rounded-2xl p-8">
                <div className="text-xs uppercase tracking-wider text-slate mb-2">
                  Cena převodu
                </div>
                {firma.puvodniCena && firma.puvodniCena > firma.cena && !firma.cenaDohodnout && (
                  <div className="text-lg text-slate line-through mb-1">
                    {formatCurrency(firma.puvodniCena)}
                  </div>
                )}
                <div
                  className={`text-4xl font-black mb-1 ${
                    firma.puvodniCena && firma.puvodniCena > firma.cena && !firma.cenaDohodnout
                      ? "text-accent"
                      : ""
                  }`}
                >
                  {firma.cenaDohodnout ? "Dohodou" : formatCurrency(firma.cena)}
                </div>
                {firma.puvodniCena && firma.puvodniCena > firma.cena && !firma.cenaDohodnout && (
                  <div className="text-xs font-bold text-accent mb-2">
                    Sleva {Math.round((1 - firma.cena / firma.puvodniCena) * 100)}%
                  </div>
                )}
                <div className="text-xs text-slate mb-6">
                  Včetně všech poplatků a notáře
                </div>

                {firma.financniProblemy === "LEHKE" && (
                  <div className="mb-4 px-3 py-2 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    ⚠️ Lehké finanční problémy
                  </div>
                )}
                {firma.financniProblemy === "TEZKE" && (
                  <div className="mb-4 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-xs text-red-900">
                    🚨 Těžké finanční problémy
                  </div>
                )}

                {firma.status === "VOLNA" && (
                  <div className="mb-4 p-4 rounded-xl bg-white border border-pearl">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center">
                        <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </span>
                      <div>
                        <div className="text-sm font-bold">Změna sídla? +{formatCurrency(firma.prevodSidlaCena)}</div>
                        <div className="text-xs text-slate mt-0.5">
                          Notářský zápis i zápis do OR vyřídíme za vás. <Link href="/sluzby/prevod-sidla" className="text-accent hover:underline">Více info</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {firma.status === "VOLNA" ? (
                  <a href="#zajem" className="btn btn-primary w-full">
                    Mám zájem
                  </a>
                ) : firma.status === "REZERVOVANA" ? (
                  <div className="text-center py-4 px-3 rounded-md bg-amber-50 border border-amber-200 text-sm text-amber-900">
                    Tato firma je momentálně <strong>rezervovaná</strong>
                  </div>
                ) : firma.status === "PRODANA" ? (
                  <div className="text-center py-4 px-3 rounded-md bg-cloud border border-pearl text-sm text-slate">
                    Tato firma už byla <strong>prodána</strong>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* CTA: Máte zájem o tuto firmu? - velký formulář pod detailem */}
      {firma.status === "VOLNA" && (
        <section id="zajem" className="py-24 mt-24 bg-cloud border-t border-pearl scroll-mt-24">
          <div className="container-max max-w-4xl">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="block w-10 h-px bg-accent"></span>
                <span className="text-xs font-medium uppercase tracking-widest text-accent">
                  Nezávazná poptávka
                </span>
                <span className="block w-10 h-px bg-accent"></span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">
                Máte zájem o {firma.nazev.replace(/ s\.r\.o\.$/i, "")}?
              </h2>
              <p className="text-lg text-slate max-w-xl mx-auto">
                Vyplňte formulář a do 24 hodin se vám ozveme s detaily k převzetí.
                Žádné poplatky, žádné závazky.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border border-pearl max-w-2xl mx-auto">
              <NakupForm firmaId={firma.id} firmaNazev={firma.nazev} />
            </div>
          </div>
        </section>
      )}

      {/* CTA: Chcete prodat firmu? */}
      <section className="py-20 bg-black text-white">
        <div className="container-max max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
            Chcete <span className="highlight">prodat</span> svoji firmu?
          </h2>
          <p className="text-silver text-lg mb-8 max-w-xl mx-auto">
            Vykupujeme s.r.o. společnosti rychle a diskrétně. Nabídka do 24 hodin.
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

function DetailRow({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <dt className="text-xs uppercase tracking-wider text-slate mb-1">
        {label}
      </dt>
      <dd className="text-sm font-medium text-graphite">{value}</dd>
    </div>
  );
}
