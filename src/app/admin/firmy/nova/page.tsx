import { NovaFirmaForm } from "@/components/admin/NovaFirmaForm";

export const metadata = { title: "Přidat firmu" };

export default function NovaFirmaPage() {
  return (
    <div>
      <h1 className="text-3xl font-black mb-2">Přidat firmu</h1>
      <p className="text-slate mb-10">
        Načti firmu z ARES podle IČO, doplň údaje a publikuj.
      </p>

      <NovaFirmaForm />
    </div>
  );
}
