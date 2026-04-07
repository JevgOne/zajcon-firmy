"use client";

import { useState } from "react";

export function NakupForm({
  firmaId,
  firmaNazev,
}: {
  firmaId: string;
  firmaNazev: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      typ: "NAKUP" as const,
      firmaId,
      jmeno: String(fd.get("jmeno") ?? "") || null,
      email: String(fd.get("email") ?? ""),
      telefon: String(fd.get("telefon") ?? "") || null,
      zpravaNakup: String(fd.get("zprava") ?? `Mám zájem o ${firmaNazev}.`),
    };

    try {
      const res = await fetch("/api/poptavky", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Odeslání selhalo");
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Něco se pokazilo");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-2">✓</div>
        <p className="text-sm font-medium">Děkujeme, ozveme se do 24 hodin.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="jmeno"
        placeholder="Jméno"
        className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none transition-colors text-sm bg-white"
      />
      <input
        name="email"
        type="email"
        required
        placeholder="E-mail"
        className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none transition-colors text-sm bg-white"
      />
      <input
        name="telefon"
        type="tel"
        placeholder="Telefon (nepovinné)"
        className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none transition-colors text-sm bg-white"
      />
      <textarea
        name="zprava"
        rows={3}
        placeholder="Zpráva (nepovinné)"
        className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none transition-colors text-sm bg-white"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary w-full disabled:opacity-60"
      >
        {submitting ? "Odesílám..." : "Mám zájem"}
      </button>
    </form>
  );
}
