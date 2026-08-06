import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { addUpload, getPeriode, getUploads } from "@/lib/queries";

export const runtime = "nodejs";

const JENIS_ALLOWED = new Set([
  "Produksi Estate–Divisi",
  "Analisa Produksi Mingguan",
  "Data Karyawan Panen",
  "Absensi Pemanen",
  "Sensus Buah",
  "Master Areal (Luas TM & TT)",
  "Standar Yield",
  "Curah Hujan",
]);

export async function GET() {
  const uploads = await getUploads();
  return NextResponse.json({ uploads });
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File tidak ditemukan pada request." }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !["xlsx", "xls", "csv"].includes(ext)) {
    return NextResponse.json({ error: "Hanya .xlsx, .xls, atau .csv yang didukung." }, { status: 400 });
  }

  const jenisRaw = formData.get("jenis");
  const jenis = typeof jenisRaw === "string" && JENIS_ALLOWED.has(jenisRaw) ? jenisRaw : "Produksi Estate–Divisi";

  const blob = await put(`pusat-data/${Date.now()}-${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  const periode = await getPeriode();
  const tanggal = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const row = await addUpload({
    nama: file.name,
    jenis,
    periode: periode.aktif,
    baris: 0,
    tanggal,
    pengunggah: "Anda",
    status: "processing",
    blobUrl: blob.url,
  });

  return NextResponse.json(row, { status: 201 });
}
