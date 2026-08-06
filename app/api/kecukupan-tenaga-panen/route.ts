import { NextResponse } from "next/server";
import { getDivisions, getKecukupanBaseline, getKecukupanMonthly } from "@/lib/queries";

export async function GET() {
  const [divisions, kecukupanBaseline, kecukupanMonthly] = await Promise.all([
    getDivisions(),
    getKecukupanBaseline(),
    getKecukupanMonthly(),
  ]);
  return NextResponse.json({ divisions, kecukupanBaseline, kecukupanMonthly });
}
