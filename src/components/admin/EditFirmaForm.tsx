"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Firma } from "@prisma/client";

export function EditFirmaForm({ firma }: { firma: Firma }) {
  const router = useRouter();
  const [nazev, setNazev] = useState(firma.nazev);
  const [cena, setCena] = useState(firma.cena);
  const [puvodniCena, setPuvodniCena] = useState<number | "">(firma.puvodniCena ?? "");
  const [cenaDohodnout, setCenaDohodnout] = useState(firma.cenaDohodnout);
  const [status, setStatus] = useState(firma.status);
  const [financniProblemy, setFinancniProblemy] = useState(firma.financniProblemy);
  const [featured, setFeatured] = useState(firma.featured);
  const [published, setPublished] = useState(firma.published);
  const [popis, setPopis] = useState(firma.popis ?? "");
  const [poznamkyInterni, setPoznamkyInterni] = useState(firma.poznamkyInterni ?? "");
  const [tags, setTags] = useState<string>(firma.tags.join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/firmy/${firma.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nazev,
          cena,
          puvodniCena: puvodniCena === "" ? null : puvodniCena,
          cenaDohodnout,
          status,
          financniProblemy,
          featured,
          published,
          popis: popis || null,
          poznamkyInterni: poznamkyInterni || null,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
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

  async function handleDelete() {
    if (!confirm(`Opravdu smazat ${firma.nazev}?`)) return;
    const res = await fetch(`/api/firmy/${firma.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/firmy");
      router.refresh();
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white border border-pearl rounded-2xl p-6 space-y-4">
        <Field label="Název">
          <input
            value={nazev}
            onChange={(e) => setNazev(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none text-sm"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Cena (Kč)">
            <input
              type="number"
              value={cena}
              onChange={(e) => setCena(parseInt(e.target.value || "0"))}
              className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none text-sm"
            />
          </Field>

          <Field label="Původní cena (sleva)">
            <input
              type="number"
              value={puvodniCena}
              onChange={(e) =>
                setPuvodniCena(e.target.value === "" ? "" : parseInt(e.target.value))
              }
              placeholder="prázdné = bez slevy"
              className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none text-sm"
            />
          </Field>

          <Field label="Stav">
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as typeof status)
              }
              className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none text-sm bg-white"
            >
              <option value="VOLNA">Volná</option>
              <option value="REZERVOVANA">Rezervováno</option>
              <option value="PRODANA">Prodáno</option>
              <option value="STAZENA">Staženo</option>
            </select>
          </Field>

          <Field label="Finanční stav">
            <select
              value={financniProblemy}
              onChange={(e) =>
                setFinancniProblemy(e.target.value as typeof financniProblemy)
              }
              className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none text-sm bg-white"
            >
              <option value="ZADNE">Bez problémů</option>
              <option value="LEHKE">Lehké problémy</option>
              <option value="TEZKE">Těžké problémy</option>
            </select>
          </Field>
        </div>

        <Field label="Tagy (oddělené čárkou)">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none text-sm"
          />
        </Field>

        <Field label="Popis">
          <textarea
            value={popis}
            onChange={(e) => setPopis(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none text-sm"
          />
        </Field>

        <Field label="Interní poznámky">
          <textarea
            value={poznamkyInterni}
            onChange={(e) => setPoznamkyInterni(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none text-sm"
          />
        </Field>

        <div className="flex flex-wrap gap-6 pt-2">
          <Checkbox checked={cenaDohodnout} onChange={setCenaDohodnout} label="Cena dohodou" />
          <Checkbox checked={featured} onChange={setFeatured} label="Featured" />
          <Checkbox checked={published} onChange={setPublished} label="Publikováno" />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleDelete}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Smazat firmu
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary disabled:opacity-50"
        >
          {saving ? "Ukládám..." : "Uložit změny"}
        </button>
      </div>
    </div>
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
