import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = { title: "Nastavení" };

export default async function NastaveniPage() {
  const settings = await prisma.settings.upsert({
    where: { id: "global" },
    create: { id: "global" },
    update: {},
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-black mb-2">Nastavení</h1>
      <p className="text-slate mb-10">Globální údaje portálu</p>

      <div className="bg-white border border-pearl rounded-2xl p-8 space-y-6">
        <Row label="Telefon" value={settings.telefon} />
        <Row label="E-mail" value={settings.email} />
        <Row label="Adresa" value={settings.adresa} />
        <Row label="Hero titulek" value={settings.heroTitle} />
        <Row label="Hero podtitulek" value={settings.heroSubtitle} />
      </div>

      <p className="text-sm text-slate mt-6">
        Editace přes admin UI bude doplněna v další verzi. Zatím lze upravit přímo v DB.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-slate uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-sm font-medium text-graphite">{value}</div>
    </div>
  );
}
