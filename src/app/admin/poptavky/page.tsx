import Link from "next/link";
import prisma from "@/lib/db";
import { formatDateShort } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = { title: "Poptávky" };

const TYP_LABEL: Record<string, string> = {
  VYKUP: "Výkup",
  NAKUP: "Nákup",
  DOTAZ: "Dotaz",
};

const STATUS_LABEL: Record<string, string> = {
  NOVA: "Nová",
  KONTAKTOVANO: "Kontaktováno",
  JEDNANI: "Jednání",
  DOKONCENO: "Dokončeno",
  ZAMITNUTO: "Zamítnuto",
};

export default async function AdminPoptavkyPage() {
  const poptavky = await prisma.poptavka.findMany({
    orderBy: { createdAt: "desc" },
    include: { firma: { select: { nazev: true } } },
  });

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Poptávky</h1>
      <p className="text-slate mb-10">{poptavky.length} poptávek celkem</p>

      {poptavky.length === 0 ? (
        <div className="bg-white border border-pearl rounded-2xl p-16 text-center text-slate">
          Zatím žádné poptávky.
        </div>
      ) : (
        <div className="bg-white border border-pearl rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-cloud border-b border-pearl">
              <tr>
                <Th>Datum</Th>
                <Th>Typ</Th>
                <Th>Kontakt</Th>
                <Th>Detail</Th>
                <Th>Stav</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {poptavky.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-pearl last:border-0 hover:bg-cloud/50"
                >
                  <td className="px-6 py-4 text-sm text-slate whitespace-nowrap">
                    {formatDateShort(p.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {TYP_LABEL[p.typ] ?? p.typ}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>{p.email}</div>
                    {p.telefon && (
                      <div className="text-xs text-slate">{p.telefon}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {p.typ === "VYKUP" && p.icoVykup && `IČO ${p.icoVykup}`}
                    {p.typ === "NAKUP" && p.firma?.nazev}
                    {p.typ === "DOTAZ" && "Obecný dotaz"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={
                        p.status === "NOVA"
                          ? "text-accent font-medium"
                          : "text-slate"
                      }
                    >
                      {STATUS_LABEL[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link
                      href={`/admin/poptavky/${p.id}`}
                      className="text-accent hover:text-accent-dark font-medium"
                    >
                      Otevřít
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
