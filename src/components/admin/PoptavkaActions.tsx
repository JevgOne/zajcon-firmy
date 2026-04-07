"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["NOVA", "KONTAKTOVANO", "JEDNANI", "DOKONCENO", "ZAMITNUTO"] as const;

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

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/poptavky/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, poznamkyInterni: poznamky || null }),
    });
    router.refresh();
    setSaving(false);
  }

  return (
    <div className="bg-white border border-pearl rounded-2xl p-8 space-y-4">
      <h2 className="text-lg font-bold">Zpracování</h2>

      <div>
        <label className="block text-sm font-medium text-graphite mb-1.5">Stav</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none text-sm bg-white"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-graphite mb-1.5">
          Interní poznámky
        </label>
        <textarea
          value={poznamky}
          onChange={(e) => setPoznamky(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none text-sm"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn btn-primary disabled:opacity-50"
      >
        {saving ? "Ukládám..." : "Uložit"}
      </button>
    </div>
  );
}
