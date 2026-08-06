// Dummy dataset — MDO-2 / Region 8A, periode aktif Juli 2026.
// Angka fiktif tapi konsisten: dibangun dari geometri chart pada mockup asli
// (Sawit Insight.dc.html) supaya dashboard, forecasting, dan kecukupan tenaga
// panen menunjuk ke angka yang sama.

export const periode = {
  aktif: "Juli 2026",
  terbit: "4 Agu 2026",
  fileCount: 6,
  historiBulan: 43,
};

export const hierarki = {
  mdo: "MDO-2",
  region: "Reg 8A",
};

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

// ---- Estate ranking (Dashboard) ----
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

export const estates: EstateRow[] = [
  { id: "sungai-bahar", nama: "Sungai Bahar", luasTM: 942, ton: 1642, tonPerHa: 1.74, achBudget: 104.2, kecTK: 98.1, hke: 91.4, restan: 18 },
  { id: "lubuk-tapang", nama: "Lubuk Tapang", luasTM: 876, ton: 1488, tonPerHa: 1.7, achBudget: 101.6, kecTK: 88.3, hke: 90.2, restan: 64 },
  { id: "tanjung-rambang", nama: "Tanjung Rambang", luasTM: 791, ton: 1294, tonPerHa: 1.64, achBudget: 95.8, kecTK: 84.7, hke: 86.4, restan: 147 },
  { id: "muara-kandis", nama: "Muara Kandis", luasTM: 728, ton: 1108, tonPerHa: 1.52, achBudget: 89.1, kecTK: 79.4, hke: 85.9, restan: 312 },
  { id: "bukit-sanggul", nama: "Bukit Sanggul", luasTM: 604, ton: 848, tonPerHa: 1.4, achBudget: 83.4, kecTK: 74.0, hke: 83.1, restan: 401 },
];

export const estateTotal = {
  nama: "Total Reg 8A",
  luasTM: estates.reduce((s, e) => s + e.luasTM, 0),
  ton: estates.reduce((s, e) => s + e.ton, 0),
  achBudget: 96.7,
  kecTK: 78.9,
  hke: 87.6,
};

// ---- Kecukupan Tenaga Panen — per divisi (18 divisi, 6 dari mockup asli) ----
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

function round1(n: number) { return Math.round(n * 10) / 10; }

function buildDivisi(row: Omit<DivisiRow, "efektif" | "gap" | "kecukupan">): DivisiRow {
  const efektif = Math.round(row.tersedia * (row.hke / 100));
  const gap = row.kebutuhan - efektif;
  const kecukupan = round1((efektif / row.kebutuhan) * 100);
  return { ...row, efektif, gap, kecukupan };
}

export const divisions: DivisiRow[] = [
  buildDivisi({ id: "sb-1", estate: "Sungai Bahar", divisi: "Div I", luasTM: 246, akp: 0.41, bjr: 5.1, rotasiRencana: 7, kebutuhan: 62, tersedia: 70, hke: 91.4 }),
  buildDivisi({ id: "sb-2", estate: "Sungai Bahar", divisi: "Div II", luasTM: 238, akp: 0.39, bjr: 5.02, rotasiRencana: 7, kebutuhan: 58, tersedia: 62, hke: 90.8 }),
  buildDivisi({ id: "sb-3", estate: "Sungai Bahar", divisi: "Div III", luasTM: 231, akp: 0.4, bjr: 5.05, rotasiRencana: 7, kebutuhan: 60, tersedia: 64, hke: 92.1 }),
  buildDivisi({ id: "sb-4", estate: "Sungai Bahar", divisi: "Div IV", luasTM: 227, akp: 0.38, bjr: 4.98, rotasiRencana: 7, kebutuhan: 56, tersedia: 60, hke: 90.5 }),
  buildDivisi({ id: "lt-1", estate: "Lubuk Tapang", divisi: "Div I", luasTM: 228, akp: 0.38, bjr: 4.94, rotasiRencana: 7, kebutuhan: 55, tersedia: 55, hke: 90.2 }),
  buildDivisi({ id: "lt-2", estate: "Lubuk Tapang", divisi: "Div II", luasTM: 224, akp: 0.37, bjr: 4.9, rotasiRencana: 8, kebutuhan: 50, tersedia: 52, hke: 89.6 }),
  buildDivisi({ id: "lt-3", estate: "Lubuk Tapang", divisi: "Div III", luasTM: 219, akp: 0.36, bjr: 4.88, rotasiRencana: 8, kebutuhan: 48, tersedia: 50, hke: 88.9 }),
  buildDivisi({ id: "lt-4", estate: "Lubuk Tapang", divisi: "Div IV", luasTM: 205, akp: 0.36, bjr: 4.85, rotasiRencana: 8, kebutuhan: 45, tersedia: 47, hke: 89.1 }),
  buildDivisi({ id: "tr-1", estate: "Tanjung Rambang", divisi: "Div I", luasTM: 220, akp: 0.37, bjr: 4.82, rotasiRencana: 7, kebutuhan: 53, tersedia: 54, hke: 87.8 }),
  buildDivisi({ id: "tr-2", estate: "Tanjung Rambang", divisi: "Div II", luasTM: 214, akp: 0.36, bjr: 4.78, rotasiRencana: 8, kebutuhan: 51, tersedia: 50, hke: 86.4 }),
  buildDivisi({ id: "tr-3", estate: "Tanjung Rambang", divisi: "Div III", luasTM: 198, akp: 0.35, bjr: 4.74, rotasiRencana: 8, kebutuhan: 47, tersedia: 46, hke: 85.6 }),
  buildDivisi({ id: "tr-4", estate: "Tanjung Rambang", divisi: "Div IV", luasTM: 159, akp: 0.34, bjr: 4.7, rotasiRencana: 9, kebutuhan: 38, tersedia: 39, hke: 85.2 }),
  buildDivisi({ id: "mk-1", estate: "Muara Kandis", divisi: "Div I", luasTM: 264, akp: 0.35, bjr: 4.7, rotasiRencana: 8, kebutuhan: 60, tersedia: 58, hke: 87.1 }),
  buildDivisi({ id: "mk-2", estate: "Muara Kandis", divisi: "Div II", luasTM: 263, akp: 0.35, bjr: 4.68, rotasiRencana: 8, kebutuhan: 59, tersedia: 56, hke: 86.3 }),
  buildDivisi({ id: "mk-3", estate: "Muara Kandis", divisi: "Div III", luasTM: 201, akp: 0.34, bjr: 4.66, rotasiRencana: 9, kebutuhan: 48, tersedia: 44, hke: 85.9 }),
  buildDivisi({ id: "bs-1", estate: "Bukit Sanggul", divisi: "Div I", luasTM: 210, akp: 0.34, bjr: 4.6, rotasiRencana: 9, kebutuhan: 52, tersedia: 49, hke: 84.6 }),
  buildDivisi({ id: "bs-2", estate: "Bukit Sanggul", divisi: "Div II", luasTM: 186, akp: 0.33, bjr: 4.52, rotasiRencana: 11, kebutuhan: 88, tersedia: 78, hke: 83.1 }),
  buildDivisi({ id: "bs-3", estate: "Bukit Sanggul", divisi: "Div III", luasTM: 208, akp: 0.33, bjr: 4.55, rotasiRencana: 9, kebutuhan: 50, tersedia: 47, hke: 84.0 }),
];

export const kecukupanTotal = {
  luasTM: divisions.reduce((s, d) => s + d.luasTM, 0),
  akp: round1(divisions.reduce((s, d) => s + d.akp, 0) / divisions.length),
  bjr: round1(divisions.reduce((s, d) => s + d.bjr, 0) / divisions.length * 10) / 10,
  rotasi: 9.4,
  kebutuhan: 358,
  tersedia: 338,
  hke: 87.6,
  efektif: 296,
  gap: 62,
  kecukupan: 78.9,
};

// Proyeksi 12 bulan (Reg 8A) — kebutuhan mengikuti musim panen, puncak September.
export const kecukupanMonthly = {
  bulan: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"],
  kebutuhan: [268, 255, 272, 286, 305, 332, 358, 381, 396, 372, 330, 292],
  tersediaEfektif: [322, 320, 316, 312, 309, 305, 301, 298, 296, 300, 304, 308],
};

export const kecukupanBaseline = {
  kecukupan: 78.9,
  kebutuhan: 358,
  tersedia: 338,
  efektif: 296,
  gap: 62,
  rotasiAktual: 9.4,
  rotasiRencana: 7,
  potensiTon: 477,
  basisBorong: 1100,
  hke: 87.6,
  jumlahPemanen: 338,
};

// ---- Monthly trend (Dashboard) — Jan–Jul aktual, Jan–Des budget, Ags–Des forecast ----
export type BulanTrend = {
  bulan: string;
  aktual: number | null;
  budget: number;
  forecast: number | null;
};

export const monthlyTrend: BulanTrend[] = [
  { bulan: "Jan", aktual: 4120, budget: 4300, forecast: null },
  { bulan: "Feb", aktual: 3780, budget: 3950, forecast: null },
  { bulan: "Mar", aktual: 4070, budget: 4400, forecast: null },
  { bulan: "Apr", aktual: 4680, budget: 4750, forecast: null },
  { bulan: "Mei", aktual: 5240, budget: 5300, forecast: null },
  { bulan: "Jun", aktual: 5910, budget: 6100, forecast: null },
  { bulan: "Jul", aktual: 6380, budget: 6600, forecast: 6380 },
  { bulan: "Ags", aktual: null, budget: 7050, forecast: 6900 },
  { bulan: "Sep", aktual: null, budget: 7400, forecast: 7250 },
  { bulan: "Okt", aktual: null, budget: 7100, forecast: 6950 },
  { bulan: "Nov", aktual: null, budget: 6300, forecast: 6150 },
  { bulan: "Des", aktual: null, budget: 5400, forecast: 5250 },
];

// ---- Forecasting Produksi — tabel bulanan ----
export type ForecastRow = {
  bulan: string;
  indeksMusiman: number;
  janjangRb: number;
  bjr: number;
  ton: number;
  tonPerHa: number;
  vsBudget: number | null;
};

// 12 bulan ke depan (Ags 2026 – Jul 2027). Horizon 3/6/12 bln mengiris array ini.
export const forecastTable: ForecastRow[] = [
  { bulan: "Agustus 2026", indeksMusiman: 9.8, janjangRb: 1362, bjr: 5.07, ton: 6900, tonPerHa: 1.75, vsBudget: 97.9 },
  { bulan: "September 2026", indeksMusiman: 10.3, janjangRb: 1418, bjr: 5.11, ton: 7250, tonPerHa: 1.84, vsBudget: 98.0 },
  { bulan: "Oktober 2026", indeksMusiman: 9.9, janjangRb: 1372, bjr: 5.07, ton: 6950, tonPerHa: 1.76, vsBudget: 100.7 },
  { bulan: "November 2026", indeksMusiman: 8.7, janjangRb: 1238, bjr: 4.97, ton: 6150, tonPerHa: 1.56, vsBudget: 100.4 },
  { bulan: "Desember 2026", indeksMusiman: 7.4, janjangRb: 1072, bjr: 4.9, ton: 5250, tonPerHa: 1.33, vsBudget: 102.3 },
  { bulan: "Januari 2027", indeksMusiman: 6.9, janjangRb: 984, bjr: 4.86, ton: 4780, tonPerHa: 1.21, vsBudget: null },
  { bulan: "Februari 2027", indeksMusiman: 5.6, janjangRb: 790, bjr: 4.95, ton: 3912, tonPerHa: 0.99, vsBudget: null },
  { bulan: "Maret 2027", indeksMusiman: 6.0, janjangRb: 842, bjr: 5.0, ton: 4212, tonPerHa: 1.07, vsBudget: null },
  { bulan: "April 2027", indeksMusiman: 6.9, janjangRb: 959, bjr: 5.05, ton: 4844, tonPerHa: 1.23, vsBudget: null },
  { bulan: "Mei 2027", indeksMusiman: 7.8, janjangRb: 1064, bjr: 5.1, ton: 5424, tonPerHa: 1.38, vsBudget: null },
  { bulan: "Juni 2027", indeksMusiman: 8.7, janjangRb: 1193, bjr: 5.13, ton: 6117, tonPerHa: 1.55, vsBudget: null },
  { bulan: "Juli 2027", indeksMusiman: 9.4, janjangRb: 1282, bjr: 5.15, ton: 6603, tonPerHa: 1.68, vsBudget: null },
];

export const accuracy = {
  mape: 6.8,
  bias: 2.1,
  aktual: [38, 42, 34, 30, 22, 16, 12, 18, 26, 32, 40, 44],
  forecast: [42, 39, 37, 27, 25, 20, 15, 15, 23, 35, 37, 41],
};

// ---- Alerts ----
export type Alert = {
  level: "merah" | "kuning";
  kicker: string;
  text: string;
  detail?: string;
  linkLabel: string;
  href: string;
};

export const alerts: Alert[] = [
  {
    level: "merah",
    kicker: "Kecukupan tenaga panen",
    text: "Bukit Sanggul Div II di 74% — puncak panen September kurang 23 pemanen.",
    detail: "Kebutuhan 88 · efektif 65 · HKE 83,1%",
    linkLabel: "Buka Kecukupan Tenaga Panen",
    href: "/kecukupan-tenaga-panen",
  },
  {
    level: "merah",
    kicker: "Turn over pemanen",
    text: "Muara Kandis 6,8% bulan ini — restan naik ke 312 ton.",
    detail: "Keluar 19 · masuk 7 · early TO 42%",
    linkLabel: "Buka Turn Over Pemanen",
    href: "/turn-over-pemanen",
  },
  {
    level: "kuning",
    kicker: "Hari kerja efektif",
    text: "Tanjung Rambang HKE 86,4% — 9 hari hujan, potensi 214 ton tertunda.",
    linkLabel: "Buka HKE",
    href: "/hari-kerja-efektif",
  },
  {
    level: "kuning",
    kicker: "Deviasi forecast",
    text: "Reg 8A menyimpang +13,1% — faktor koreksi perlu dikalibrasi.",
    linkLabel: "Buka Forecasting",
    href: "/forecasting",
  },
];

// ---- Uploads (Pusat Data recent activity) ----
export type UploadRow = {
  nama: string;
  jenis: string;
  periode: string;
  baris: number;
  tanggal: string;
  pengunggah: string;
  status: "ok" | "processing" | "warn";
};

export const uploads: UploadRow[] = [
  { nama: "produksi_juli_2026.xlsx", jenis: "Produksi Estate–Divisi", periode: "Juli 2026", baris: 1248, tanggal: "4 Agu 2026", pengunggah: "Rangga H.", status: "ok" },
  { nama: "absensi_panen_juli.xlsx", jenis: "Absensi Pemanen", periode: "Juli 2026", baris: 5382, tanggal: "4 Agu 2026", pengunggah: "Rangga H.", status: "ok" },
  { nama: "sensus_buah_q3.xlsx", jenis: "Sensus Buah", periode: "Q3 2026", baris: 214, tanggal: "3 Agu 2026", pengunggah: "Dewi S.", status: "warn" },
];
