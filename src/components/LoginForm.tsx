"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "");
    const password = String(fd.get("password") ?? "");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Nesprávný email nebo heslo");
      setSubmitting(false);
      return;
    }

    const from = params.get("from") || "/admin";
    router.push(from);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-graphite mb-1.5">
          E-mail
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none transition-colors text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-graphite mb-1.5">
          Heslo
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-md border border-pearl focus:border-accent focus:outline-none transition-colors text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary w-full disabled:opacity-60"
      >
        {submitting ? "Přihlašuji..." : "Přihlásit se"}
      </button>
    </form>
  );
}
