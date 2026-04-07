import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

type Ctx = { params: Promise<{ id: string }> };

const updateSchema = z.object({
  status: z
    .enum(["NOVA", "KONTAKTOVANO", "JEDNANI", "DOKONCENO", "ZAMITNUTO"])
    .optional(),
  poznamkyInterni: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
});

export async function GET(_req: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const poptavka = await prisma.poptavka.findUnique({
    where: { id },
    include: { firma: true },
  });
  if (!poptavka) {
    return NextResponse.json({ error: "Nenalezeno" }, { status: 404 });
  }
  return NextResponse.json(poptavka);
}

export async function PUT(req: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const poptavka = await prisma.poptavka.update({
    where: { id },
    data: parsed.data,
  });
  return NextResponse.json(poptavka);
}
