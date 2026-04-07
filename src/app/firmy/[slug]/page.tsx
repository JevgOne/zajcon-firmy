import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NakupForm } from "@/components/NakupForm";
import { formatCurrency } from "@/lib/pricing";
import { calculateAge } from "@/lib/ares";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const firma = await prisma.firma.findUnique({ where: { slug } }).catch(() => null);
  if (!firma) return { title: "Firma nenalezena" };
  return {
    title: firma.metaTitle ?? firma.nazev,
    description:
      firma.metaDescription ??
      `${firma.nazev} - hotová firma s.r.o. k převzetí. ${formatCurrency(firma.cena)}.`,
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
      <Navbar />

      <main className="pt-32 pb-24 min-h-screen">
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
                <div className="text-4xl font-black mb-1">
                  {firma.cenaDohodnout ? "Dohodou" : formatCurrency(firma.cena)}
                </div>
                <div className="text-xs text-slate mb-6">
                  Včetně všech poplatků a notáře
                </div>

                {firma.status === "VOLNA" ? (
                  <NakupForm firmaId={firma.id} firmaNazev={firma.nazev} />
                ) : (
                  <div className="text-center py-6 text-slate">
                    Tato firma je momentálně{" "}
                    {firma.status === "REZERVOVANA" ? "rezervovaná" : "nedostupná"}.
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

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
