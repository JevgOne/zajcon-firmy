import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { PoptavkaActions } from "@/components/admin/PoptavkaActions";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Detail poptávky" };

export default async function PoptavkaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const poptavka = await prisma.poptavka.findUnique({
    where: { id },
    include: { firma: true },
  });
  if (!poptavka) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/poptavky"
        className="inline-flex items-center gap-2 text-sm text-slate hover:text-black mb-6"
      >
        ← Zpět
      </Link>

      <h1 className="text-3xl font-black mb-2">Poptávka #{poptavka.id.slice(-6)}</h1>
      <p className="text-slate mb-10">{formatDate(poptavka.createdAt)}</p>

      <div className="bg-white border border-pearl rounded-2xl p-8 space-y-6">
        <Row label="Typ">{poptavka.typ}</Row>
        <Row label="E-mail">
          <a href={`mailto:${poptavka.email}`} className="text-accent">
            {poptavka.email}
          </a>
        </Row>
        {poptavka.telefon && (
          <Row label="Telefon">
            <a href={`tel:${poptavka.telefon}`} className="text-accent">
              {poptavka.telefon}
            </a>
          </Row>
        )}
        {poptavka.jmeno && <Row label="Jméno">{poptavka.jmeno}</Row>}
        {poptavka.icoVykup && <Row label="IČO k výkupu">{poptavka.icoVykup}</Row>}
        {poptavka.firma && <Row label="Firma">{poptavka.firma.nazev}</Row>}
        {poptavka.poznamkaVykup && (
          <Row label="Poznámka">{poptavka.poznamkaVykup}</Row>
        )}
        {poptavka.zpravaNakup && <Row label="Zpráva">{poptavka.zpravaNakup}</Row>}
      </div>

      <div className="mt-8">
        <PoptavkaActions
          id={poptavka.id}
          status={poptavka.status}
          poznamky={poptavka.poznamkyInterni ?? ""}
        />
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <dt className="text-xs uppercase tracking-wider text-slate">{label}</dt>
      <dd className="col-span-2 text-sm text-graphite">{children}</dd>
    </div>
  );
}
