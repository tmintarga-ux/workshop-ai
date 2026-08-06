import { NextResponse } from "next/server";
import { getDivisions, getEstates, getHierarki } from "@/lib/queries";

export async function GET() {
  const [hierarki, estates, divisions] = await Promise.all([getHierarki(), getEstates(), getDivisions()]);
  return NextResponse.json({
    hierarki,
    estates: estates.map((e) => ({ id: e.id, nama: e.nama })),
    divisions: divisions.map((d) => ({ id: d.id, divisi: d.divisi, estate: d.estate })),
  });
}
