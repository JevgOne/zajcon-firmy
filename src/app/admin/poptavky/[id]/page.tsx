import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { PoptavkaActions } from "@/components/admin/PoptavkaActions";
import { formatDate } from "@/lib/utils";
import { formatCurrency } from "@/lib/pricing";

export const metadata = { title: "Detail poptávky" };

const TYP_META: Record<
  string,
  { label: string; color: string; bg: string; desc: string }
> = {
  NAKUP: {
    label: "Nákup firmy",
    color: "text-available",
    bg: "bg-available/10",
    desc: "Klient má zájem o konkrétní firmu z naší nabídky",
  },
  VYKUP: {
    label: "Výkup firmy",
    color: "text-accent",
    bg: "bg-accent/10",
    desc: "Klient nám chce prodat svoji firmu",
  },
  DOTAZ: {
    label: "Obecný dotaz",
    color: "text-slate",
    bg: "bg-cloud",
    desc: "Klient má obecnou otázku",
  },
};

export default async function PoptavkaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const poptavka = await prisma.poptavka.findUnique({
    where: { id },
    include: { firma: true },
  });
  if (!poptavka) notFound();

  const typ = TYP_META[poptavka.typ] ?? TYP_META.DOTAZ;
  const created = new Date(poptavka.createdAt);
  const ageMs = Date.now() - created.getTime();
  const ageHours = Math.round(ageMs / (1000 * 60 * 60));
  const ageDays = Math.round(ageMs / (1000 * 60 * 60 * 24));
  const ageLabel =
    ageHours < 24
      ? `${ageHours} ${ageHours === 1 ? "hodinu" : ageHours <= 4 ? "hodiny" : "hodin"} starý`
      : `${ageDays} ${ageDays === 1 ? "den" : ageDays <= 4 ? "dny" : "dní"} starý`;

  return (
    <div className="max-w-5xl">
      <Link
        href="/admin/poptavky"
        className="inline-flex items-center gap-2 text-sm text-slate hover:text-black mb-6 transition-colors"
      >
        ← Zpět na seznam
      </Link>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${typ.color} ${typ.bg}`}
            >
              {typ.label}
            </span>
            {poptavka.status === "NOVA" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent/15 text-accent">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                Nová
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black mb-1">
            Poptávka #{poptavka.id.slice(-6).toUpperCase()}
          </h1>
          <p className="text-slate text-sm">
            {formatDate(poptavka.createdAt)} · {ageLabel}
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex flex-wrap gap-2">
          <a
            href={`mailto:${poptavka.email}?subject=Re: Vaše poptávka #${poptavka.id.slice(-6).toUpperCase()}&body=Dobrý den${poptavka.jmeno ? " " + poptavka.jmeno : ""},%0D%0A%0D%0AděkujemenpVáš zájem...%0D%0A%0D%0AS pozdravem,%0D%0AZajcon Firmy`}
            className="btn btn-primary"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Odpovědět e-mailem
          </a>
          {poptavka.telefon && (
            <a href={`tel:${poptavka.telefon}`} className="btn btn-accent">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Zavolat
            </a>
          )}
        </div>
      </div>

      <p className="text-sm text-slate mb-8">{typ.desc}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HLAVNÍ OBSAH */}
        <div className="lg:col-span-2 space-y-6">
          {/* KONTAKT */}
          <Card title="Kontakt">
            <div className="space-y-4">
              {poptavka.jmeno && (
                <Row label="Jméno">
                  <strong className="text-black">{poptavka.jmeno}</strong>
                </Row>
              )}
              <Row label="E-mail">
                <a
                  href={`mailto:${poptavka.email}`}
                  className="text-accent hover:underline"
                >
                  {poptavka.email}
                </a>
              </Row>
              {poptavka.telefon && (
                <Row label="Telefon">
                  <a
                    href={`tel:${poptavka.telefon}`}
                    className="text-accent hover:underline"
                  >
                    {poptavka.telefon}
                  </a>
                </Row>
              )}
            </div>
          </Card>

          {/* DETAIL PODLE TYPU */}
          {poptavka.typ === "NAKUP" && poptavka.firma && (
            <Card title="Firma o kterou má zájem">
              <Link
                href={`/admin/firmy/${poptavka.firma.id}`}
                className="block p-4 -m-4 rounded-lg hover:bg-cloud transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-silver uppercase tracking-wider mb-1">
                      IČO {poptavka.firma.ico}
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      {poptavka.firma.nazev}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-xs text-slate">
                      <span>Stav: <strong className="text-graphite">{poptavka.firma.status}</strong></span>
                      <span>·</span>
                      <span>ZK: {formatCurrency(poptavka.firma.zakladniKapital)}</span>
                      {poptavka.firma.platceDph && (
                        <>
                          <span>·</span>
                          <span>Plátce DPH</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-black text-accent">
                      {poptavka.firma.cenaDohodnout
                        ? "Dohodou"
                        : formatCurrency(poptavka.firma.cena)}
                    </div>
                    <div className="text-xs text-slate mt-1">→ Otevřít v adminu</div>
                  </div>
                </div>
              </Link>
            </Card>
          )}

          {poptavka.typ === "VYKUP" && (
            <Card title="Firma kterou chce prodat">
              <div className="space-y-3">
                {poptavka.icoVykup && (
                  <div>
                    <div className="text-xs text-silver uppercase tracking-wider mb-1">
                      IČO společnosti
                    </div>
                    <div className="flex items-center gap-3">
                      <strong className="text-xl font-bold">
                        {poptavka.icoVykup}
                      </strong>
                      <a
                        href={`https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${poptavka.icoVykup}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline"
                      >
                        ARES ↗
                      </a>
                      <a
                        href={`https://or.justice.cz/ias/ui/rejstrik-$firma?ico=${poptavka.icoVykup}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline"
                      >
                        Justice.cz ↗
                      </a>
                    </div>
                  </div>
                )}
                {poptavka.poznamkaVykup && (
                  <div>
                    <div className="text-xs text-silver uppercase tracking-wider mb-1">
                      Poznámka klienta
                    </div>
                    <p className="text-sm text-graphite leading-relaxed whitespace-pre-wrap">
                      {poptavka.poznamkaVykup}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {poptavka.zpravaNakup && (
            <Card title="Zpráva od klienta">
              <p className="text-sm text-graphite leading-relaxed whitespace-pre-wrap">
                {poptavka.zpravaNakup}
              </p>
            </Card>
          )}

          {/* TRACKING */}
          {(poptavka.utmSource || poptavka.utmMedium || poptavka.utmCampaign) && (
            <Card title="Zdroj návštěvy">
              <div className="space-y-2 text-xs">
                {poptavka.utmSource && (
                  <Row label="Source">{poptavka.utmSource}</Row>
                )}
                {poptavka.utmMedium && (
                  <Row label="Medium">{poptavka.utmMedium}</Row>
                )}
                {poptavka.utmCampaign && (
                  <Row label="Campaign">{poptavka.utmCampaign}</Row>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* SIDEBAR – stavy a poznámky */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-8">
            <PoptavkaActions
              id={poptavka.id}
              status={poptavka.status}
              poznamky={poptavka.poznamkyInterni ?? ""}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-pearl rounded-2xl p-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-slate mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <dt className="text-xs uppercase tracking-wider text-slate">{label}</dt>
      <dd className="col-span-2 text-sm text-graphite">{children}</dd>
    </div>
  );
}
