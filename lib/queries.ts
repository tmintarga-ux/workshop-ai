import { sql } from "@/lib/db";
import type {
  Accuracy,
  Alert,
  BulanTrend,
  DivisiRow,
  EstateRow,
  EstateTotal,
  ForecastRow,
  Hierarki,
  KecukupanBaseline,
  KecukupanMonthly,
  KecukupanTotal,
  Periode,
  UploadRow,
} from "@/lib/data";

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

async function getSetting<T>(key: string): Promise<T> {
  const rows = await sql`select value from app_settings where key = ${key}`;
  if (!rows.length) throw new Error(`Setting "${key}" belum di-seed — jalankan npm run db:seed.`);
  return rows[0].value as T;
}

export async function getPeriode(): Promise<Periode> {
  return getSetting<Periode>("periode");
}

export async function getHierarki(): Promise<Hierarki> {
  return getSetting<Hierarki>("hierarki");
}

export async function getEstates(): Promise<EstateRow[]> {
  const rows = await sql`select id, nama, luas_tm, ton, ton_per_ha, ach_budget, kec_tk, hke, restan from estates order by ton desc`;
  return rows.map((r) => ({
    id: r.id,
    nama: r.nama,
    luasTM: Number(r.luas_tm),
    ton: Number(r.ton),
    tonPerHa: Number(r.ton_per_ha),
    achBudget: Number(r.ach_budget),
    kecTK: Number(r.kec_tk),
    hke: Number(r.hke),
    restan: Number(r.restan),
  }));
}

export async function getEstateTotal(): Promise<EstateTotal> {
  return getSetting<EstateTotal>("estateTotal");
}

export async function getDivisions(): Promise<DivisiRow[]> {
  const rows = await sql`select id, estate, divisi, luas_tm, akp, bjr, rotasi_rencana, kebutuhan, tersedia, hke from divisions order by id`;
  return rows.map((r) => {
    const tersedia = Number(r.tersedia);
    const hke = Number(r.hke);
    const kebutuhan = Number(r.kebutuhan);
    const efektif = Math.round(tersedia * (hke / 100));
    const gap = kebutuhan - efektif;
    const kecukupan = round1((efektif / kebutuhan) * 100);
    return {
      id: r.id,
      estate: r.estate,
      divisi: r.divisi,
      luasTM: Number(r.luas_tm),
      akp: Number(r.akp),
      bjr: Number(r.bjr),
      rotasiRencana: Number(r.rotasi_rencana),
      kebutuhan,
      tersedia,
      hke,
      efektif,
      gap,
      kecukupan,
    };
  });
}

export async function getKecukupanTotal(): Promise<KecukupanTotal> {
  return getSetting<KecukupanTotal>("kecukupanTotal");
}

export async function getKecukupanMonthly(): Promise<KecukupanMonthly> {
  return getSetting<KecukupanMonthly>("kecukupanMonthly");
}

export async function getKecukupanBaseline(): Promise<KecukupanBaseline> {
  return getSetting<KecukupanBaseline>("kecukupanBaseline");
}

export async function getMonthlyTrend(): Promise<BulanTrend[]> {
  const rows = await sql`select bulan, aktual, budget, forecast from monthly_trend order by urutan`;
  return rows.map((r) => ({
    bulan: r.bulan,
    aktual: r.aktual == null ? null : Number(r.aktual),
    budget: Number(r.budget),
    forecast: r.forecast == null ? null : Number(r.forecast),
  }));
}

export async function getForecastTable(): Promise<ForecastRow[]> {
  const rows = await sql`select bulan, indeks_musiman, janjang_rb, bjr, ton, ton_per_ha, vs_budget from forecast_table order by urutan`;
  return rows.map((r) => ({
    bulan: r.bulan,
    indeksMusiman: Number(r.indeks_musiman),
    janjangRb: Number(r.janjang_rb),
    bjr: Number(r.bjr),
    ton: Number(r.ton),
    tonPerHa: Number(r.ton_per_ha),
    vsBudget: r.vs_budget == null ? null : Number(r.vs_budget),
  }));
}

export async function getAccuracy(): Promise<Accuracy> {
  return getSetting<Accuracy>("accuracy");
}

export async function getAlerts(): Promise<Alert[]> {
  const rows = await sql`select level, kicker, text, detail, link_label, href from alerts order by urutan`;
  return rows.map((r) => ({
    level: r.level,
    kicker: r.kicker,
    text: r.text,
    detail: r.detail,
    linkLabel: r.link_label,
    href: r.href,
  }));
}

export async function getUploads(limit?: number): Promise<UploadRow[]> {
  const rows = limit
    ? await sql`select id, nama, jenis, periode, baris, tanggal, pengunggah, status, blob_url from uploads order by created_at desc limit ${limit}`
    : await sql`select id, nama, jenis, periode, baris, tanggal, pengunggah, status, blob_url from uploads order by created_at desc`;
  return rows.map((r) => ({
    id: r.id,
    nama: r.nama,
    jenis: r.jenis,
    periode: r.periode,
    baris: Number(r.baris),
    tanggal: r.tanggal,
    pengunggah: r.pengunggah,
    status: r.status,
    blobUrl: r.blob_url,
  }));
}

export async function addUpload(row: Omit<UploadRow, "id">): Promise<UploadRow> {
  const rows = await sql`
    insert into uploads (nama, jenis, periode, baris, tanggal, pengunggah, status, blob_url)
    values (${row.nama}, ${row.jenis}, ${row.periode}, ${row.baris}, ${row.tanggal}, ${row.pengunggah}, ${row.status}, ${row.blobUrl ?? null})
    returning id, nama, jenis, periode, baris, tanggal, pengunggah, status, blob_url
  `;
  const r = rows[0];
  return {
    id: r.id,
    nama: r.nama,
    jenis: r.jenis,
    periode: r.periode,
    baris: Number(r.baris),
    tanggal: r.tanggal,
    pengunggah: r.pengunggah,
    status: r.status,
    blobUrl: r.blob_url,
  };
}
