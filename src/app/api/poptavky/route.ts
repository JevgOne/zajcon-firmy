import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";
import { poptavkaSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const poptavky = await prisma.poptavka.findMany({
    orderBy: { createdAt: "desc" },
    include: { firma: { select: { nazev: true, slug: true } } },
  });
  return NextResponse.json(poptavky);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = poptavkaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const poptavka = await prisma.poptavka.create({
    data: parsed.data,
  });
  return NextResponse.json(poptavka, { status: 201 });
}
