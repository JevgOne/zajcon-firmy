// One-shot script: přepočítat ceny existujících firem podle aktuálního algoritmu
// Spuštění: pnpm tsx prisma/recalculate-prices.ts
//
// Pokud je nová doporučená cena nižší než aktuální → starou cenu uloží jako puvodniCena (sleva).
// Pokud je nová vyšší → upgrade na novou cenu.
// Skip cenaDohodnout firmy.

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { calculatePrice } from "../src/lib/pricing";
import { calculateAge } from "../src/lib/ares";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const firmy = await prisma.firma.findMany({
    orderBy: { cena: "desc" },
  });

  console.log(`Nalezeno ${firmy.length} firem k přepočtu.\n`);
  console.log(
    "IČO       | Název                       | Stará → Nová         | Změna"
  );
  console.log("-".repeat(85));

  let updated = 0;
  let unchanged = 0;
  let priceLowered = 0;
  let priceRaised = 0;

  for (const firma of firmy) {
    if (firma.cenaDohodnout) {
      console.log(
        `${firma.ico} | ${firma.nazev.padEnd(28).slice(0, 28)} | DOHODOU              | skip`
      );
      continue;
    }

    const age = calculateAge(firma.datumZalozeni);
    const result = calculatePrice({
      stariRoky: age,
      zakladniKapital: firma.zakladniKapital,
      platceDph: firma.platceDph,
      historieObratu: firma.historieObratu,
      premium: firma.featured,
    });

    const oldPrice = firma.cena;
    const newPrice = result.finalPrice;
    const diff = newPrice - oldPrice;
    const diffPct = oldPrice > 0 ? Math.round((diff / oldPrice) * 100) : 0;

    let action: string;
    let updateData: { cena: number; puvodniCena?: number | null } = {
      cena: newPrice,
    };

    if (newPrice === oldPrice) {
      action = "beze změny";
      unchanged++;
    } else if (newPrice < oldPrice) {
      // Nová cena nižší → uložit starou jako puvodniCena (sleva)
      updateData.puvodniCena = oldPrice;
      action = `SLEVA ${diffPct}%`;
      priceLowered++;
      updated++;
    } else {
      // Nová cena vyšší → upgrade, smazat puvodniCena pokud byla
      updateData.puvodniCena = null;
      action = `+${diffPct}%`;
      priceRaised++;
      updated++;
    }

    console.log(
      `${firma.ico} | ${firma.nazev.padEnd(28).slice(0, 28)} | ${oldPrice
        .toLocaleString("cs-CZ")
        .padStart(8)} → ${newPrice
        .toLocaleString("cs-CZ")
        .padStart(8)} Kč | ${action}`
    );

    if (newPrice !== oldPrice) {
      await prisma.firma.update({
        where: { id: firma.id },
        data: updateData,
      });
    }
  }

  console.log("\n" + "=".repeat(85));
  console.log(
    `Hotovo. Updated: ${updated} (${priceLowered} sníženo, ${priceRaised} zvýšeno), beze změny: ${unchanged}`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
