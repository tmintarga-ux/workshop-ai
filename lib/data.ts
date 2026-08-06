// Konfigurasi & aturan bisnis statis. Data operasional (estate, divisi, tren,
// forecast, alert, unggahan, periode) sekarang datang dari Neon — lihat lib/queries.ts.

export type Semaphore = "merah" | "kuning" | "hijau";

export function semaphoreAchBudget(pct: number): Semaphore {
  if (pct < 90) return "merah";
  if (pct <= 100) return "kuning";
  return "hijau";
}
export function semaphoreKecukupanTK(pct: number): Semaphore {
  if (pct < 80) return "merah";
  if (pct < 95) return "kuning";
  return "hijau";
}
export function semaphoreHKE(pct: number): Semaphore {
  if (pct < 85) return "merah";
  if (pct < 90) return "kuning";
  return "hijau";
}
export function semaphoreTurnOver(pct: number): Semaphore {
  if (pct > 5) return "merah";
  if (pct >= 3) return "kuning";
  return "hijau";
}
export function semaphoreDeviasiForecast(pct: number): Semaphore {
  const abs = Math.abs(pct);
  if (abs > 20) return "merah";
  if (abs >= 10) return "kuning";
  return "hijau";
}

export const thresholds = [
  { metrik: "Ach. Budget / Forecast", merah: "< 90%", kuning: "90–100%", hijau: "≥ 100%" },
  { metrik: "Kecukupan Tenaga Panen", merah: "< 80%", kuning: "80–95%", hijau: "≥ 95%" },
  { metrik: "HKE", merah: "< 85%", kuning: "85–90%", hijau: "≥ 90%" },
  { metrik: "Turn Over Pemanen (bulanan)", merah: "> 5%", kuning: "3–5%", hijau: "≤ 3%" },
  { metrik: "Deviasi Forecast", merah: "> ±20%", kuning: "±10–20%", hijau: "≤ ±10%" },
];

export const formulaKpi: Record<string, string> = {
  produksi: "Janjang × BJR ÷ 1.000 × Faktor koreksi. Sumber: Produksi Estate–Divisi.",
  achBudget: "Aktual ÷ Budget × 100. Sumber: Produksi Estate–Divisi & Budgeting Produksi.",
  achForecast: "Aktual ÷ Forecast × 100. Sumber: Produksi Estate–Divisi & Forecasting.",
  kecukupanTk: "Pemanen Efektif ÷ Kebutuhan Pemanen × 100. Kebutuhan = (Luas TM ÷ Rotasi × SPH × AKP × BJR) ÷ Basis Borong.",
  hke: "HK Efektif ÷ HK Tersedia × 100. Sumber: Absensi Pemanen.",
  gap: "Kebutuhan Pemanen − Pemanen Efektif (orang).",
  rotasiAktual: "Rotasi rencana × (Kebutuhan ÷ Efektif) — molor saat pemanen efektif di bawah kebutuhan.",
  potensiTon: "Gap (orang) × Basis Borong (Kg/HK) × Hari kerja ÷ 1.000.",
  mape: "Rata-rata |Aktual − Forecast| ÷ Aktual × 100, dihitung dari 12 bulan realisasi terakhir.",
  bias: "Rata-rata (Aktual − Forecast) — konsisten positif/negatif menandakan kesalahan sistematis.",
};

// ---- Tipe data operasional (diisi dari Neon lewat /api/*, lihat lib/queries.ts) ----
export type EstateRow = {
  id: string;
  nama: string;
  luasTM: number;
  ton: number;
  tonPerHa: number;
  achBudget: number;
  kecTK: number;
  hke: number;
  restan: number;
};

export type EstateTotal = {
  nama: string;
  luasTM: number;
  ton: number;
  achBudget: number;
  kecTK: number;
  hke: number;
};

export type DivisiRow = {
  id: string;
  estate: string;
  divisi: string;
  luasTM: number;
  akp: number;
  bjr: number;
  rotasiRencana: number;
  kebutuhan: number;
  tersedia: number;
  hke: number;
  efektif: number;
  gap: number;
  kecukupan: number;
};

export type KecukupanTotal = {
  luasTM: number;
  akp: number;
  bjr: number;
  rotasi: number;
  kebutuhan: number;
  tersedia: number;
  hke: number;
  efektif: number;
  gap: number;
  kecukupan: number;
};

export type KecukupanMonthly = {
  bulan: string[];
  kebutuhan: number[];
  tersediaEfektif: number[];
};

export type KecukupanBaseline = {
  kecukupan: number;
  kebutuhan: number;
  tersedia: number;
  efektif: number;
  gap: number;
  rotasiAktual: number;
  rotasiRencana: number;
  potensiTon: number;
  basisBorong: number;
  hke: number;
  jumlahPemanen: number;
};

export type BulanTrend = {
  bulan: string;
  aktual: number | null;
  budget: number;
  forecast: number | null;
};

export type ForecastRow = {
  bulan: string;
  indeksMusiman: number;
  janjangRb: number;
  bjr: number;
  ton: number;
  tonPerHa: number;
  vsBudget: number | null;
};

export type Accuracy = {
  mape: number;
  bias: number;
  aktual: number[];
  forecast: number[];
};

export type Alert = {
  level: "merah" | "kuning";
  kicker: string;
  text: string;
  detail?: string | null;
  linkLabel: string;
  href: string;
};

export type UploadRow = {
  id?: number;
  nama: string;
  jenis: string;
  periode: string;
  baris: number;
  tanggal: string;
  pengunggah: string;
  status: "ok" | "processing" | "warn";
  blobUrl?: string | null;
};

export type Periode = {
  aktif: string;
  terbit: string;
  fileCount: number;
  historiBulan: number;
};

export type Hierarki = {
  mdo: string;
  region: string;
};
