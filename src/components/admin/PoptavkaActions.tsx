"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUS_FLOW = [
  { key: "NOVA", label: "Nová", color: "bg-accent text-white", desc: "Nezpracovaná" },
  { key: "KONTAKTOVANO", label: "Kontaktováno", color: "bg-blue-500 text-white", desc: "Volal jsem / mailoval" },
  { key: "JEDNANI", label: "V jednání", color: "bg-amber-500 text-white", desc: "Probíhá vyjednávání" },
  { key: "DOKONCENO", label: "Dokončeno", color: "bg-green-600 text-white", desc: "Úspěšně uzavřeno" },
  { key: "ZAMITNUTO", label: "Zamítnuto", color: "bg-slate text-white", desc: "Klient odpadl" },
] as const;

export function PoptavkaActions({
  id,
  status: initialStatus,
  poznamky: initialPoznamky,
}: {
  id: string;
  status: string;
  poznamky: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [poznamky, setPoznamky] = useState(initialPoznamky);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  async function save(newStatus?: string) {
    setSaving(true);
    const targetStatus = newStatus ?? status;
    await fetch(`/api/poptavky/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: targetStatus,
        poznamkyInterni: poznamky || null,
      }),
    });
    if (newStatus) setStatus(newStatus);
    setSavedAt(new Date());
    router.refresh();
    setSaving(false);
  }

  return (
    <div className="bg-white border border-pearl rounded-2xl p-6 space-y-6">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate mb-4">
          Stav poptávky
        </h2>
        <div className="space-y-2">
          {STATUS_FLOW.map((s) => {
            const isActive = status === s.key;
            return (
              <button
                key={s.key}
                onClick={() => save(s.key)}
                disabled={saving || isActive}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border ${
                  isActive
                    ? `${s.color} border-transparent`
                    : "bg-white border-pearl text-graphite hover:border-accent hover:bg-cloud disabled:opacity-50"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive ? "bg-white" : "bg-slate"
                  }`}
                ></span>
                <div className="flex-1">
                  <div className="text-sm font-bold">{s.label}</div>
                  <div className={`text-xs ${isActive ? "opacity-90" : "text-slate"}`}>
                    {s.desc}
                  </div>
                </div>
                {isActive && (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate mb-3">
          Interní poznámky
        </h2>
        <textarea
          value={poznamky}
          onChange={(e) => setPoznamky(e.target.value)}
          rows={5}
          placeholder="Zápis z hovoru, domluvený postup, další kroky..."
          className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none text-sm resize-none"
        />
        <button
          onClick={() => save()}
          disabled={saving}
          className="btn btn-primary w-full mt-3 disabled:opacity-50"
        >
          {saving ? "Ukládám..." : "Uložit poznámky"}
        </button>
        {savedAt && !saving && (
          <p className="text-xs text-slate mt-2 text-center">
            ✓ Uloženo {savedAt.toLocaleTimeString("cs-CZ")}
          </p>
        )}
      </div>
    </div>
  );
}
