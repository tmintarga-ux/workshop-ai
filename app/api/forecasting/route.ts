import { NextResponse } from "next/server";
import { getAccuracy, getForecastTable, getKecukupanTotal, getMonthlyTrend } from "@/lib/queries";

export async function GET() {
  const [forecastTable, monthlyTrend, accuracy, kecukupanTotal] = await Promise.all([
    getForecastTable(),
    getMonthlyTrend(),
    getAccuracy(),
    getKecukupanTotal(),
  ]);
  return NextResponse.json({ forecastTable, monthlyTrend, accuracy, kecukupanTotal });
}
