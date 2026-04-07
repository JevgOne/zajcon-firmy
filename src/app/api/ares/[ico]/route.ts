import { NextResponse } from "next/server";
import { fetchFromAres } from "@/lib/ares";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ ico: string }> }
) {
  const { ico } = await ctx.params;
  try {
    const data = await fetchFromAres(ico);
    if (!data) {
      return NextResponse.json({ error: "Firma nenalezena" }, { status: 404 });
    }
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Neznámá chyba";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
