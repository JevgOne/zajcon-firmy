import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@zajcon.cz";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      name: "Administrator",
      passwordHash,
      role: "ADMIN",
    },
    update: { passwordHash },
  });

  console.log(`✓ Admin: ${adminEmail}`);

  await prisma.settings.upsert({
    where: { id: "global" },
    create: { id: "global" },
    update: {},
  });

  console.log("✓ Settings");

  // Demo firmy (jen pokud žádné nejsou)
  const count = await prisma.firma.count();
  if (count === 0) {
    await prisma.firma.createMany({
      data: [
        {
          ico: "09182736",
          slug: "premium-invest",
          nazev: "PREMIUM Invest s.r.o.",
          datumZalozeni: new Date("2014-08-15"),
          sidloUlice: "Václavské náměstí 1",
          sidloMesto: "Praha 1",
          sidloPsc: "11000",
          zakladniKapital: 2_000_000,
          platceDph: true,
          historieObratu: true,
          cena: 385_000,
          status: "VOLNA",
          featured: true,
          tags: ["10+ let", "Vysoký ZK", "Reference", "Pro úvěry"],
          popis:
            "Prémiová společnost s desetiletou historií a aktivním obratem. Ideální pro bankovní financování nebo účast ve veřejných zakázkách. Kompletně prověřená, bez jakýchkoliv závazků.",
          published: true,
        },
        {
          ico: "14253647",
          slug: "nova-trade",
          nazev: "NOVA Trade s.r.o.",
          datumZalozeni: new Date("2019-03-10"),
          sidloUlice: "Nádražní 15",
          sidloMesto: "Brno",
          sidloPsc: "60200",
          zakladniKapital: 200_000,
          platceDph: true,
          cena: 89_000,
          status: "VOLNA",
          tags: ["5 let", "DPH plátce"],
          published: true,
        },
        {
          ico: "28374651",
          slug: "global-services",
          nazev: "GLOBAL Services s.r.o.",
          datumZalozeni: new Date("2021-06-01"),
          sidloUlice: "Plzeňská 100",
          sidloMesto: "Praha 5",
          sidloPsc: "15000",
          zakladniKapital: 1_000,
          cena: 45_000,
          status: "REZERVOVANA",
          tags: ["3 roky", "Ready-made"],
          published: true,
        },
        {
          ico: "37465829",
          slug: "delta-consulting",
          nazev: "DELTA Consulting s.r.o.",
          datumZalozeni: new Date("2017-11-20"),
          sidloUlice: "Dlouhá 8",
          sidloMesto: "Ostrava",
          sidloPsc: "70200",
          zakladniKapital: 500_000,
          platceDph: true,
          historieObratu: true,
          cena: 125_000,
          status: "VOLNA",
          tags: ["7 let", "DPH", "Historie"],
          published: true,
        },
        {
          ico: "49587362",
          slug: "apex-development",
          nazev: "APEX Development s.r.o.",
          datumZalozeni: new Date("2023-01-20"),
          sidloUlice: "Krátká 5",
          sidloMesto: "Plzeň",
          sidloPsc: "30100",
          zakladniKapital: 1_000,
          cena: 32_000,
          status: "VOLNA",
          tags: ["2 roky", "Ready-made"],
          published: true,
        },
      ],
    });
    console.log("✓ Demo firmy (5)");
  } else {
    console.log(`✓ Firmy už existují (${count})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
