import Link from "next/link";
import prisma from "@/lib/db";
import { formatCurrency } from "@/lib/pricing";
import { formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Firmy" };

const STATUS_LABEL: Record<string, string> = {
  VOLNA: "Volná",
  REZERVOVANA: "Rezervováno",
  PRODANA: "Prodáno",
  STAZENA: "Staženo",
};

export default async function AdminFirmyPage() {
  const firmy = await prisma.firma.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2">Firmy</h1>
          <p className="text-slate">{firmy.length} firem v katalogu</p>
        </div>
        <Link href="/admin/firmy/nova" className="btn btn-primary">
          + Přidat firmu
        </Link>
      </div>

      {firmy.length === 0 ? (
        <div className="bg-white border border-pearl rounded-2xl p-16 text-center">
          <p className="text-slate mb-4">Zatím nejsou žádné firmy.</p>
          <Link href="/admin/firmy/nova" className="btn btn-primary">
            Přidat první firmu
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-pearl rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-cloud border-b border-pearl">
              <tr>
                <Th>Název / IČO</Th>
                <Th>Cena</Th>
                <Th>Stav</Th>
                <Th>Publikováno</Th>
                <Th>Vytvořeno</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {firmy.map((f) => (
                <tr key={f.id} className="border-b border-pearl last:border-0 hover:bg-cloud/50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{f.nazev}</div>
                    <div className="text-xs text-slate">IČO {f.ico}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {f.cenaDohodnout ? "Dohodou" : formatCurrency(f.cena)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {STATUS_LABEL[f.status] ?? f.status}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {f.published ? (
                      <span className="text-available font-medium">Ano</span>
                    ) : (
                      <span className="text-slate">Koncept</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate">
                    {formatDateShort(f.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link
                      href={`/admin/firmy/${f.id}`}
                      className="text-accent hover:text-accent-dark font-medium"
                    >
                      Upravit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-slate font-medium">
      {children}
    </th>
  );
}
