"use client";

import { useState } from "react";

export function ProdatForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload = {
      typ: "VYKUP" as const,
      icoVykup: String(fd.get("ico") ?? ""),
      email: String(fd.get("email") ?? ""),
      telefon: String(fd.get("telefon") ?? "") || null,
      jmeno: String(fd.get("jmeno") ?? "") || null,
      poznamkaVykup: String(fd.get("poznamka") ?? "") || null,
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
      <div className="py-8 text-center">
        <div className="text-5xl mb-3">✓</div>
        <h4 className="text-lg font-bold mb-2">Děkujeme!</h4>
        <p className="text-sm text-slate">
          Ozveme se do 24 hodin s nezávaznou nabídkou.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="IČO společnosti" name="ico" placeholder="12345678" pattern="[0-9]{8}" required />
      <Field label="Jméno (nepovinné)" name="jmeno" placeholder="Jan Novák" />
      <Field label="Váš e-mail" name="email" type="email" placeholder="jan.novak@email.cz" required />
      <Field label="Telefon (nepovinné)" name="telefon" type="tel" placeholder="+420 ..." />
      <div>
        <label className="block text-sm font-medium text-graphite mb-1.5">
          Poznámka (nepovinné)
        </label>
        <textarea
          name="poznamka"
          rows={3}
          className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none transition-colors text-sm"
          placeholder="Popište stav firmy..."
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={submitting} className="btn btn-accent w-full disabled:opacity-60">
        {submitting ? "Odesílám..." : "Odeslat poptávku"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  pattern,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  pattern?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-graphite mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        pattern={pattern}
        required={required}
        className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none transition-colors text-sm"
      />
    </div>
  );
}
