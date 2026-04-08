import Link from "next/link";
import type { Firma } from "@prisma/client";
import { formatCurrency } from "@/lib/pricing";
import { calculateAge } from "@/lib/ares";

const STATUS_LABEL: Record<string, string> = {
  VOLNA: "Volná",
  REZERVOVANA: "Rezervováno",
  PRODANA: "Prodáno",
  STAZENA: "Staženo",
};

const STATUS_CLASS: Record<string, string> = {
  VOLNA: "status-available",
  REZERVOVANA: "status-reserved",
  PRODANA: "status-prodana",
  STAZENA: "status-prodana",
};

export function FirmaCard({
  firma,
  featured = false,
}: {
  firma: Firma;
  featured?: boolean;
}) {
  const monthLabel = new Intl.DateTimeFormat("cs-CZ", {
    month: "long",
    year: "numeric",
  }).format(firma.datumZalozeni);

  const age = calculateAge(firma.datumZalozeni);
  const isProdana = firma.status === "PRODANA";
  const hasSleva =
    !firma.cenaDohodnout && firma.puvodniCena && firma.puvodniCena > firma.cena;
  const slevaPct = hasSleva
    ? Math.round((1 - firma.cena / (firma.puvodniCena ?? firma.cena)) * 100)
    : 0;

  return (
    <article
      className={`company-card relative ${featured ? "featured" : ""} ${
        isProdana ? "opacity-70 grayscale-[40%]" : ""
      }`}
    >
      {/* PRODANO překryvný badge */}
      {isProdana && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-block px-4 py-1.5 rounded-md bg-black text-white text-xs font-bold uppercase tracking-wider rotate-3 shadow-lg">
            Prodáno
          </span>
        </div>
      )}

      {/* SLEVA badge (jen u nesoldovaných) */}
      {!isProdana && hasSleva && (
        <div className="absolute -top-2 -right-2 z-10">
          <span
            className="inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg"
            style={{ background: "var(--color-accent)", color: "white" }}
          >
            -{slevaPct}% sleva
          </span>
        </div>
      )}

      <div>
        <div className="flex justify-between items-start mb-5">
          <div>
            <span className="text-xs font-medium text-silver uppercase tracking-wider">
              IČO {firma.ico}
            </span>
            <h3 className="text-xl font-bold text-black mt-1">{firma.nazev}</h3>
          </div>
          {!isProdana && (
            <span className={STATUS_CLASS[firma.status] ?? "status-prodana"}>
              {STATUS_LABEL[firma.status]}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <Meta label="Založeno" value={monthLabel} />
          <Meta
            label="Základní kapitál"
            value={formatCurrency(firma.zakladniKapital)}
          />
          {featured && (
            <>
              <Meta
                label="Historie"
                value={firma.historieObratu ? "Aktivní obrat" : "Bez obratu"}
              />
              <Meta label="DPH" value={firma.platceDph ? "Plátce" : "Neplátce"} />
            </>
          )}
        </div>

        {/* Finanční problémy badge */}
        {firma.financniProblemy === "LEHKE" && (
          <div className="mb-4 px-3 py-2 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-900">
            ⚠️ Lehké finanční problémy (drobné závazky)
          </div>
        )}
        {firma.financniProblemy === "TEZKE" && (
          <div className="mb-4 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-xs text-red-900">
            🚨 Těžké finanční problémy (značné závazky)
          </div>
        )}

        {(firma.tags.length > 0 || age >= 0) && (
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="tag">{age > 0 ? `${age} let` : "Ready-made"}</span>
            {firma.tags.slice(0, 4).map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={featured ? "flex flex-col justify-between" : ""}>
        {featured && firma.popis && (
          <p className="text-sm text-slate leading-relaxed mb-6">{firma.popis}</p>
        )}
        <div className="flex justify-between items-end pt-5 border-t border-pearl">
          <div>
            {hasSleva && !isProdana && (
              <div className="text-sm text-slate line-through leading-none mb-1">
                {formatCurrency(firma.puvodniCena ?? 0)}
              </div>
            )}
            <span
              className={`text-2xl font-bold ${
                hasSleva && !isProdana ? "text-accent" : "text-black"
              }`}
            >
              {firma.cenaDohodnout ? "Dohodou" : formatCurrency(firma.cena)}
            </span>
          </div>
          <Link
            href={`/firmy/${firma.slug}`}
            className={featured ? "btn btn-primary" : "btn btn-secondary"}
          >
            Detail
          </Link>
        </div>
      </div>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-silver uppercase tracking-wider">{label}</span>
      <p className="text-sm font-medium text-graphite mt-0.5">{value}</p>
    </div>
  );
}
