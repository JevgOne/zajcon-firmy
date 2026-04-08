// llms-full.txt - kompletní markdown export katalogu pro AI vyhledávače
// Spec: https://llmstxt.org/

import prisma from "@/lib/db";
import { calculateAge } from "@/lib/ares";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  VOLNA: "Volná",
  REZERVOVANA: "Rezervovaná",
  PRODANA: "Prodaná",
  STAZENA: "Stažená",
};

export async function GET() {
  const firmy = await prisma.firma
    .findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    })
    .catch(() => []);

  const lines: string[] = [
    "# Zajcon Firmy — kompletní katalog",
    "",
    "> Aktuální nabídka hotových s.r.o. společností k převzetí. Provozovatel: Zajíček Consulting s.r.o., IČO 07343957, Brno. Kontakt: +420 733 179 199, firmy@zajcon.cz",
    "",
    `Aktualizováno: ${new Date().toISOString().split("T")[0]}`,
    `Celkem firem v katalogu: ${firmy.length}`,
    "",
    "---",
    "",
  ];

  for (const f of firmy) {
    const age = calculateAge(f.datumZalozeni);
    const cena = f.cenaDohodnout
      ? "dohodou"
      : `${f.cena.toLocaleString("cs-CZ")} Kč`;

    lines.push(`## ${f.nazev}`);
    lines.push("");
    lines.push(`**URL:** https://firmy.zajcon.cz/firmy/${f.slug}`);
    lines.push(`**IČO:** ${f.ico}`);
    lines.push(`**Stav:** ${STATUS_LABEL[f.status] ?? f.status}`);
    lines.push(`**Cena:** ${cena}`);
    lines.push(
      `**Datum založení:** ${f.datumZalozeni.toISOString().split("T")[0]} (stáří: ${age} let)`
    );
    lines.push(
      `**Základní kapitál:** ${f.zakladniKapital.toLocaleString("cs-CZ")} Kč`
    );
    lines.push(
      `**Sídlo:** ${f.sidloUlice}, ${f.sidloPsc} ${f.sidloMesto}`
    );
    lines.push(`**Plátce DPH:** ${f.platceDph ? "Ano" : "Ne"}`);
    lines.push(`**Aktivní obrat:** ${f.historieObratu ? "Ano" : "Ne"}`);
    if (f.tags.length > 0) {
      lines.push(`**Tagy:** ${f.tags.join(", ")}`);
    }
    if (f.popis) {
      lines.push("");
      lines.push(f.popis);
    }
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });
}
