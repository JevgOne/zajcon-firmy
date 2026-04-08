// Projede všechny firmy v DB, načte aktuální data z ARES (vč. ZK z VR)
// a aktualizuje DB. Po update přepočítá doporučenou cenu (stejná logika
// jako v admin formu).
//
// Spuštění: pnpm tsx prisma/refresh-from-ares.ts

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { fetchFromAres, calculateAge } from "../src/lib/ares";
import { calculatePrice } from "../src/lib/pricing";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const firmy = await prisma.firma.findMany({
    orderBy: { createdAt: "asc" },
  });

  console.log(`Refresh ${firmy.length} firem z ARES VR...\n`);
  console.log(
    "IČO       | Název                       | ZK starý → ZK nový      | Cena → Cena"
  );
  console.log("-".repeat(95));

  for (const firma of firmy) {
    try {
      const ares = await fetchFromAres(firma.ico);
      if (!ares) {
        console.log(
          `${firma.ico} | ${firma.nazev.padEnd(28).slice(0, 28)} | NENALEZENO V ARES`
        );
        continue;
      }

      const oldZk = firma.zakladniKapital;
      const newZk = ares.zakladniKapital;
      const zkChanged = oldZk !== newZk;

      // Přepočet ceny pokud není dohodou
      let priceUpdate = {};
      let priceChange = "—";
      if (!firma.cenaDohodnout) {
        const result = calculatePrice({
          stariRoky: calculateAge(firma.datumZalozeni),
          zakladniKapital: newZk,
          platceDph: firma.platceDph,
          historieObratu: firma.historieObratu,
          premium: firma.featured,
        });
        if (result.finalPrice !== firma.cena) {
          priceUpdate = { cena: result.finalPrice };
          priceChange = `${firma.cena.toLocaleString("cs-CZ")} → ${result.finalPrice.toLocaleString("cs-CZ")} Kč`;
        } else {
          priceChange = `${firma.cena.toLocaleString("cs-CZ")} Kč (beze změny)`;
        }
      } else {
        priceChange = "DOHODOU";
      }

      // Update DB jen pokud se něco změnilo
      if (zkChanged || Object.keys(priceUpdate).length > 0) {
        await prisma.firma.update({
          where: { id: firma.id },
          data: {
            zakladniKapital: newZk,
            ...priceUpdate,
          },
        });
      }

      const zkChangeStr = zkChanged
        ? `${oldZk.toLocaleString("cs-CZ")} → ${newZk.toLocaleString("cs-CZ")} Kč`
        : `${oldZk.toLocaleString("cs-CZ")} Kč (beze změny)`;

      console.log(
        `${firma.ico} | ${firma.nazev.padEnd(28).slice(0, 28)} | ${zkChangeStr.padEnd(24)} | ${priceChange}`
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "neznámá chyba";
      console.log(
        `${firma.ico} | ${firma.nazev.padEnd(28).slice(0, 28)} | CHYBA: ${msg}`
      );
    }
  }

  console.log("\nHotovo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
