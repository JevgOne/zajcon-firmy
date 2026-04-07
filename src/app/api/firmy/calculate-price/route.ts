import { NextResponse } from "next/server";
import { calculatePrice } from "@/lib/pricing";
import { calculatePriceSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = calculatePriceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const result = calculatePrice(parsed.data);
  return NextResponse.json(result);
}
