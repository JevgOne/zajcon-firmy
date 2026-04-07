import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { EditFirmaForm } from "@/components/admin/EditFirmaForm";

export const metadata = { title: "Upravit firmu" };

export default async function EditFirmaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const firma = await prisma.firma.findUnique({ where: { id } });
  if (!firma) notFound();

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">{firma.nazev}</h1>
      <p className="text-slate mb-10">IČO {firma.ico}</p>
      <EditFirmaForm firma={firma} />
    </div>
  );
}
