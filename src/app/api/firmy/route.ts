import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";
import { firmaSchema } from "@/lib/validations";
import { generateSlug } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
  const offset = parseInt(searchParams.get("offset") ?? "0");
  const minStari = searchParams.get("minStari");
  const cenaDo = searchParams.get("cenaDo");

  const where: Prisma.FirmaWhereInput = {
    published: true,
    status: { not: "PRODANA" },
  };

  if (cenaDo) {
    where.cena = { lte: parseInt(cenaDo) };
  }

  if (minStari) {
    const yearsAgo = new Date();
    yearsAgo.setFullYear(yearsAgo.getFullYear() - parseInt(minStari));
    where.datumZalozeni = { lte: yearsAgo };
  }

  const [firmy, total] = await Promise.all([
    prisma.firma.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: limit,
      skip: offset,
    }),
    prisma.firma.count({ where }),
  ]);

  return NextResponse.json({ firmy, total });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = firmaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const slug = await uniqueSlug(generateSlug(data.nazev));

  try {
    const firma = await prisma.firma.create({
      data: { ...data, slug },
    });
    return NextResponse.json(firma, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { error: "Firma s tímto IČO již existuje" },
        { status: 409 }
      );
    }
    throw err;
  }
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let i = 1;
  while (await prisma.firma.findUnique({ where: { slug } })) {
    i++;
    slug = `${base}-${i}`;
  }
  return slug;
}
