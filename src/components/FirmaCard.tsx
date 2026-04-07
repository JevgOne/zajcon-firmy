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

export function FirmaCard({ firma, featured = false }: { firma: Firma; featured?: boolean }) {
  const monthLabel = new Intl.DateTimeFormat("cs-CZ", {
    month: "long",
    year: "numeric",
  }).format(firma.datumZalozeni);

  const age = calculateAge(firma.datumZalozeni);

  return (
    <article className={`company-card ${featured ? "featured" : ""}`}>
      <div>
        <div className="flex justify-between items-start mb-5">
          <div>
            <span className="text-xs font-medium text-silver uppercase tracking-wider">
              IČO {firma.ico}
            </span>
            <h3 className="text-xl font-bold text-black mt-1">{firma.nazev}</h3>
          </div>
          <span className={STATUS_CLASS[firma.status] ?? "status-prodana"}>
            {STATUS_LABEL[firma.status]}
          </span>
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

        {firma.tags.length > 0 && (
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
          <span className="text-2xl font-bold text-black">
            {firma.cenaDohodnout ? "Dohodou" : formatCurrency(firma.cena)}
          </span>
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
