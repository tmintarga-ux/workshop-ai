import { NextResponse } from "next/server";
import { getAlerts, getEstateTotal, getEstates, getMonthlyTrend, getPeriode, getUploads } from "@/lib/queries";

export async function GET() {
  const [alerts, estates, estateTotal, monthlyTrend, uploads, periode] = await Promise.all([
    getAlerts(),
    getEstates(),
    getEstateTotal(),
    getMonthlyTrend(),
    getUploads(3),
    getPeriode(),
  ]);
  return NextResponse.json({ alerts, estates, estateTotal, monthlyTrend, uploads, periode });
}
