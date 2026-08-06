import { NextResponse } from "next/server";
import { getHierarki, getPeriode } from "@/lib/queries";

export async function GET() {
  const [periode, hierarki] = await Promise.all([getPeriode(), getHierarki()]);
  return NextResponse.json({ periode, hierarki });
}
