"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ParsedCompanyData } from "@/lib/ares";
import type { PriceResult } from "@/lib/pricing";

const TAG_OPTIONS = [
  "Ready-made",
  "S historií",
  "Premium",
  "Pro úvěry",
  "Pro tendry",
];

export function NovaFirmaForm() {
  const router = useRouter();
  const [ico, setIco] = useState("");
  const [loading, setLoading] = useState(false);
  const [aresData, setAresData] = useState<ParsedCompanyData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [zakladniKapital, setZakladniKapital] = useState(1000);
  const [platceDph, setPlatceDph] = useState(false);
  const [historieObratu, setHistorieObratu] = useState(false);
  const [premium, setPremium] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [popis, setPopis] = useState("");
  const [cena, setCena] = useState(0);
  const [cenaDohodnout, setCenaDohodnout] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [priceResult, setPriceResult] = useState<PriceResult | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleAresLookup() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ares/${ico}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Načtení selhalo");
      }
      const data = (await res.json()) as ParsedCompanyData;
      setAresData(data);
      // Auto-calc price
      await recalc({
        stariRoky: yearsSince(new Date(data.datumZalozeni)),
        zakladniKapital,
        platceDph,
        historieObratu,
        premium,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba");
    } finally {
      setLoading(false);
    }
  }

  async function recalc(overrides?: Partial<{
    stariRoky: number;
    zakladniKapital: number;
    platceDph: boolean;
    historieObratu: boolean;
    premium: boolean;
  }>) {
    if (!aresData && !overrides?.stariRoky) return;
    const stari = overrides?.stariRoky ?? (aresData ? yearsSince(new Date(aresData.datumZalozeni)) : 0);
    const res = await fetch("/api/firmy/calculate-price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stariRoky: stari,
        zakladniKapital: overrides?.zakladniKapital ?? zakladniKapital,
        platceDph: overrides?.platceDph ?? platceDph,
        historieObratu: overrides?.historieObratu ?? historieObratu,
        premium: overrides?.premium ?? premium,
      }),
    });
    const data = (await res.json()) as PriceResult;
    setPriceResult(data);
    setCena(data.finalPrice);
  }

  async function handleSubmit(publish: boolean) {
    if (!aresData) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/firmy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ico: aresData.ico,
          nazev: aresData.nazev,
          datumZalozeni: aresData.datumZalozeni,
          sidloUlice: aresData.sidlo.ulice,
          sidloMesto: aresData.sidlo.mesto,
          sidloPsc: aresData.sidlo.psc,
          predmetPodnikani: aresData.predmetPodnikani,
          zakladniKapital,
          platceDph,
          historieObratu,
          tags,
          popis: popis || null,
          cena,
          cenaDohodnout,
          featured,
          published: publish,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Uložení selhalo");
      }
      router.push("/admin/firmy");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <h2 className="text-lg font-bold mb-4">1. Načíst z ARES</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={ico}
            onChange={(e) => setIco(e.target.value.replace(/\D/g, "").slice(0, 8))}
            placeholder="12345678"
            maxLength={8}
            className="flex-1 px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none text-sm"
          />
          <button
            onClick={handleAresLookup}
            disabled={loading || ico.length !== 8}
            className="btn btn-primary disabled:opacity-50"
          >
            {loading ? "Načítám..." : "Načíst"}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </Card>

      {aresData && (
        <>
          <Card>
            <h2 className="text-lg font-bold mb-4">2. Údaje z ARES</h2>
            <dl className="grid grid-cols-2 gap-4">
              <DL label="Název" value={aresData.nazev} />
              <DL label="IČO" value={aresData.ico} />
              <DL
                label="Datum založení"
                value={new Date(aresData.datumZalozeni).toLocaleDateString("cs-CZ")}
              />
              <DL
                label="Stáří"
                value={`${yearsSince(new Date(aresData.datumZalozeni))} let`}
              />
              <DL
                label="Sídlo"
                value={`${aresData.sidlo.ulice}, ${aresData.sidlo.psc} ${aresData.sidlo.mesto}`}
                full
              />
            </dl>
          </Card>

          <Card>
            <h2 className="text-lg font-bold mb-4">3. Doplňující údaje</h2>
            <div className="space-y-4">
              <Field label="Základní kapitál (Kč)">
                <input
                  type="number"
                  value={zakladniKapital}
                  onChange={(e) => {
                    const v = parseInt(e.target.value || "0");
                    setZakladniKapital(v);
                    recalc({ zakladniKapital: v });
                  }}
                  className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none text-sm"
                />
              </Field>

              <div className="flex flex-wrap gap-6">
                <Checkbox
                  checked={platceDph}
                  onChange={(v) => {
                    setPlatceDph(v);
                    recalc({ platceDph: v });
                  }}
                  label="Plátce DPH"
                />
                <Checkbox
                  checked={historieObratu}
                  onChange={(v) => {
                    setHistorieObratu(v);
                    recalc({ historieObratu: v });
                  }}
                  label="Aktivní obrat"
                />
                <Checkbox
                  checked={premium}
                  onChange={(v) => {
                    setPremium(v);
                    recalc({ premium: v });
                  }}
                  label="Premium"
                />
              </div>

              <Field label="Tagy">
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() =>
                        setTags(
                          tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t]
                        )
                      }
                      className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                        tags.includes(t)
                          ? "bg-accent text-white border-accent"
                          : "bg-white border-pearl text-graphite hover:border-accent"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Popis (nepovinné)">
                <textarea
                  value={popis}
                  onChange={(e) => setPopis(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none text-sm"
                />
              </Field>
            </div>
          </Card>

          {priceResult && (
            <Card>
              <h2 className="text-lg font-bold mb-4">4. Cena</h2>
              <div className="bg-cloud rounded-xl p-4 mb-4">
                <div className="text-xs text-slate uppercase tracking-wider mb-2">
                  Doporučená kalkulace
                </div>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span>Základní cena</span>
                    <span>{priceResult.basePrice.toLocaleString("cs-CZ")} Kč</span>
                  </li>
                  {priceResult.breakdown.map((b, i) => (
                    <li key={i} className="flex justify-between text-slate">
                      <span>{b.factor}</span>
                      <span>+{b.adjustment.toLocaleString("cs-CZ")} Kč</span>
                    </li>
                  ))}
                  <li className="flex justify-between font-bold pt-2 border-t border-pearl mt-2">
                    <span>Doporučeno</span>
                    <span>
                      {priceResult.finalPrice.toLocaleString("cs-CZ")} Kč
                    </span>
                  </li>
                </ul>
                <div className="text-xs text-slate mt-2">
                  Rozmezí: {priceResult.suggestedRange.min.toLocaleString("cs-CZ")} –{" "}
                  {priceResult.suggestedRange.max.toLocaleString("cs-CZ")} Kč
                </div>
              </div>

              <Field label="Finální cena (Kč)">
                <input
                  type="number"
                  value={cena}
                  onChange={(e) => setCena(parseInt(e.target.value || "0"))}
                  step={1000}
                  className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none text-sm"
                />
              </Field>

              <div className="mt-4 flex gap-6">
                <Checkbox
                  checked={cenaDohodnout}
                  onChange={setCenaDohodnout}
                  label="Cena dohodou"
                />
                <Checkbox checked={featured} onChange={setFeatured} label="Featured" />
              </div>
            </Card>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={saving}
              className="btn btn-secondary disabled:opacity-50"
            >
              {saving ? "Ukládám..." : "Uložit jako koncept"}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={saving}
              className="btn btn-primary disabled:opacity-50"
            >
              {saving ? "Ukládám..." : "Publikovat"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-pearl rounded-2xl p-6">{children}</div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-graphite mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-accent"
      />
      <span className="text-sm text-graphite">{label}</span>
    </label>
  );
}

function DL({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <dt className="text-xs text-slate uppercase tracking-wider mb-0.5">
        {label}
      </dt>
      <dd className="text-sm font-medium text-graphite">{value}</dd>
    </div>
  );
}

function yearsSince(date: Date): number {
  const now = new Date();
  let y = now.getFullYear() - date.getFullYear();
  const m = now.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < date.getDate())) y--;
  return Math.max(0, y);
}
