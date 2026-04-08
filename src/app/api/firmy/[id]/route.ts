import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/db";
import { auth } from "@/auth";
import { firmaSchema } from "@/lib/validations";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const firma = await prisma.firma.findUnique({ where: { id } });
  if (!firma) {
    return NextResponse.json({ error: "Nenalezeno" }, { status: 404 });
  }
  return NextResponse.json(firma);
}

export async function PUT(req: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json();
  const parsed = firmaSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const firma = await prisma.firma.update({
    where: { id },
    data: parsed.data,
  });
  revalidatePath("/");
  revalidatePath("/firmy");
  revalidatePath("/pro-uvery");
  revalidatePath("/pro-tendry");
  revalidatePath("/ready-made");
  revalidatePath(`/firmy/${firma.slug}`);
  return NextResponse.json(firma);
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const firma = await prisma.firma.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/firmy");
  revalidatePath(`/firmy/${firma.slug}`);
  return NextResponse.json({ ok: true });
}
