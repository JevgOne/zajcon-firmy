import Link from "next/link";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboard() {
  const [totalFirmy, volneFirmy, novePoptavky, totalPoptavky] = await Promise.all([
    prisma.firma.count(),
    prisma.firma.count({ where: { status: "VOLNA", published: true } }),
    prisma.poptavka.count({ where: { status: "NOVA" } }),
    prisma.poptavka.count(),
  ]).catch(() => [0, 0, 0, 0]);

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Dashboard</h1>
      <p className="text-slate mb-10">Přehled stavu portálu</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Stat label="Firmy v katalogu" value={totalFirmy} href="/admin/firmy" />
        <Stat label="Volné k prodeji" value={volneFirmy} href="/admin/firmy" />
        <Stat
          label="Nové poptávky"
          value={novePoptavky}
          href="/admin/poptavky"
          highlight
        />
        <Stat label="Poptávek celkem" value={totalPoptavky} href="/admin/poptavky" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/firmy/nova"
          className="bg-white border border-pearl rounded-2xl p-8 hover:border-accent hover:-translate-y-px transition-all"
        >
          <h2 className="text-xl font-bold mb-2">+ Přidat firmu</h2>
          <p className="text-sm text-slate">
            Načti firmu z ARES podle IČO a publikuj.
          </p>
        </Link>
        <Link
          href="/admin/poptavky"
          className="bg-white border border-pearl rounded-2xl p-8 hover:border-accent hover:-translate-y-px transition-all"
        >
          <h2 className="text-xl font-bold mb-2">Nové poptávky</h2>
          <p className="text-sm text-slate">
            Zobraz a zpracuj poptávky od klientů.
          </p>
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  highlight,
}: {
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block bg-white border rounded-2xl p-6 hover:border-accent hover:-translate-y-px transition-all ${
        highlight && value > 0 ? "border-accent" : "border-pearl"
      }`}
    >
      <div className="text-xs text-slate uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="text-3xl font-black">{value}</div>
    </Link>
  );
}
