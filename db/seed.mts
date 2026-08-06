import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL belum diset di environment.");
}

const sql = neon(connectionString);

const periode = {
  aktif: "Juli 2026",
  terbit: "4 Agu 2026",
  fileCount: 6,
  historiBulan: 43,
};

const hierarki = { mdo: "MDO-2", region: "Reg 8A" };

const estates = [
  { id: "sungai-bahar", nama: "Sungai Bahar", luasTM: 942, ton: 1642, tonPerHa: 1.74, achBudget: 104.2, kecTK: 98.1, hke: 91.4, restan: 18 },
  { id: "lubuk-tapang", nama: "Lubuk Tapang", luasTM: 876, ton: 1488, tonPerHa: 1.7, achBudget: 101.6, kecTK: 88.3, hke: 90.2, restan: 64 },
  { id: "tanjung-rambang", nama: "Tanjung Rambang", luasTM: 791, ton: 1294, tonPerHa: 1.64, achBudget: 95.8, kecTK: 84.7, hke: 86.4, restan: 147 },
  { id: "muara-kandis", nama: "Muara Kandis", luasTM: 728, ton: 1108, tonPerHa: 1.52, achBudget: 89.1, kecTK: 79.4, hke: 85.9, restan: 312 },
  { id: "bukit-sanggul", nama: "Bukit Sanggul", luasTM: 604, ton: 848, tonPerHa: 1.4, achBudget: 83.4, kecTK: 74.0, hke: 83.1, restan: 401 },
];

const estateTotal = {
  nama: "Total Reg 8A",
  luasTM: estates.reduce((s, e) => s + e.luasTM, 0),
  ton: estates.reduce((s, e) => s + e.ton, 0),
  achBudget: 96.7,
  kecTK: 78.9,
  hke: 87.6,
};

const divisions = [
  { id: "sb-1", estate: "Sungai Bahar", divisi: "Div I", luasTM: 246, akp: 0.41, bjr: 5.1, rotasiRencana: 7, kebutuhan: 62, tersedia: 70, hke: 91.4 },
  { id: "sb-2", estate: "Sungai Bahar", divisi: "Div II", luasTM: 238, akp: 0.39, bjr: 5.02, rotasiRencana: 7, kebutuhan: 58, tersedia: 62, hke: 90.8 },
  { id: "sb-3", estate: "Sungai Bahar", divisi: "Div III", luasTM: 231, akp: 0.4, bjr: 5.05, rotasiRencana: 7, kebutuhan: 60, tersedia: 64, hke: 92.1 },
  { id: "sb-4", estate: "Sungai Bahar", divisi: "Div IV", luasTM: 227, akp: 0.38, bjr: 4.98, rotasiRencana: 7, kebutuhan: 56, tersedia: 60, hke: 90.5 },
  { id: "lt-1", estate: "Lubuk Tapang", divisi: "Div I", luasTM: 228, akp: 0.38, bjr: 4.94, rotasiRencana: 7, kebutuhan: 55, tersedia: 55, hke: 90.2 },
  { id: "lt-2", estate: "Lubuk Tapang", divisi: "Div II", luasTM: 224, akp: 0.37, bjr: 4.9, rotasiRencana: 8, kebutuhan: 50, tersedia: 52, hke: 89.6 },
  { id: "lt-3", estate: "Lubuk Tapang", divisi: "Div III", luasTM: 219, akp: 0.36, bjr: 4.88, rotasiRencana: 8, kebutuhan: 48, tersedia: 50, hke: 88.9 },
  { id: "lt-4", estate: "Lubuk Tapang", divisi: "Div IV", luasTM: 205, akp: 0.36, bjr: 4.85, rotasiRencana: 8, kebutuhan: 45, tersedia: 47, hke: 89.1 },
  { id: "tr-1", estate: "Tanjung Rambang", divisi: "Div I", luasTM: 220, akp: 0.37, bjr: 4.82, rotasiRencana: 7, kebutuhan: 53, tersedia: 54, hke: 87.8 },
  { id: "tr-2", estate: "Tanjung Rambang", divisi: "Div II", luasTM: 214, akp: 0.36, bjr: 4.78, rotasiRencana: 8, kebutuhan: 51, tersedia: 50, hke: 86.4 },
  { id: "tr-3", estate: "Tanjung Rambang", divisi: "Div III", luasTM: 198, akp: 0.35, bjr: 4.74, rotasiRencana: 8, kebutuhan: 47, tersedia: 46, hke: 85.6 },
  { id: "tr-4", estate: "Tanjung Rambang", divisi: "Div IV", luasTM: 159, akp: 0.34, bjr: 4.7, rotasiRencana: 9, kebutuhan: 38, tersedia: 39, hke: 85.2 },
  { id: "mk-1", estate: "Muara Kandis", divisi: "Div I", luasTM: 264, akp: 0.35, bjr: 4.7, rotasiRencana: 8, kebutuhan: 60, tersedia: 58, hke: 87.1 },
  { id: "mk-2", estate: "Muara Kandis", divisi: "Div II", luasTM: 263, akp: 0.35, bjr: 4.68, rotasiRencana: 8, kebutuhan: 59, tersedia: 56, hke: 86.3 },
  { id: "mk-3", estate: "Muara Kandis", divisi: "Div III", luasTM: 201, akp: 0.34, bjr: 4.66, rotasiRencana: 9, kebutuhan: 48, tersedia: 44, hke: 85.9 },
  { id: "bs-1", estate: "Bukit Sanggul", divisi: "Div I", luasTM: 210, akp: 0.34, bjr: 4.6, rotasiRencana: 9, kebutuhan: 52, tersedia: 49, hke: 84.6 },
  { id: "bs-2", estate: "Bukit Sanggul", divisi: "Div II", luasTM: 186, akp: 0.33, bjr: 4.52, rotasiRencana: 11, kebutuhan: 88, tersedia: 78, hke: 83.1 },
  { id: "bs-3", estate: "Bukit Sanggul", divisi: "Div III", luasTM: 208, akp: 0.33, bjr: 4.55, rotasiRencana: 9, kebutuhan: 50, tersedia: 47, hke: 84.0 },
];

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

const kecukupanTotal = {
  luasTM: divisions.reduce((s, d) => s + d.luasTM, 0),
  akp: round1(divisions.reduce((s, d) => s + d.akp, 0) / divisions.length),
  bjr: round1((divisions.reduce((s, d) => s + d.bjr, 0) / divisions.length) * 10) / 10,
  rotasi: 9.4,
  kebutuhan: 358,
  tersedia: 338,
  hke: 87.6,
  efektif: 296,
  gap: 62,
  kecukupan: 78.9,
};

const kecukupanMonthly = {
  bulan: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"],
  kebutuhan: [268, 255, 272, 286, 305, 332, 358, 381, 396, 372, 330, 292],
  tersediaEfektif: [322, 320, 316, 312, 309, 305, 301, 298, 296, 300, 304, 308],
};

const kecukupanBaseline = {
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

const monthlyTrend = [
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

const forecastTable = [
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

const accuracy = {
  mape: 6.8,
  bias: 2.1,
  aktual: [38, 42, 34, 30, 22, 16, 12, 18, 26, 32, 40, 44],
  forecast: [42, 39, 37, 27, 25, 20, 15, 15, 23, 35, 37, 41],
};

const alerts = [
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
    detail: null,
    linkLabel: "Buka HKE",
    href: "/hari-kerja-efektif",
  },
  {
    level: "kuning",
    kicker: "Deviasi forecast",
    text: "Reg 8A menyimpang +13,1% — faktor koreksi perlu dikalibrasi.",
    detail: null,
    linkLabel: "Buka Forecasting",
    href: "/forecasting",
  },
];

const uploads = [
  { nama: "produksi_juli_2026.xlsx", jenis: "Produksi Estate–Divisi", periode: "Juli 2026", baris: 1248, tanggal: "4 Agu 2026", pengunggah: "Rangga H.", status: "ok" },
  { nama: "absensi_panen_juli.xlsx", jenis: "Absensi Pemanen", periode: "Juli 2026", baris: 5382, tanggal: "4 Agu 2026", pengunggah: "Rangga H.", status: "ok" },
  { nama: "sensus_buah_q3.xlsx", jenis: "Sensus Buah", periode: "Q3 2026", baris: 214, tanggal: "3 Agu 2026", pengunggah: "Dewi S.", status: "warn" },
];

async function main() {
  await sql`delete from estates`;
  await sql`delete from divisions`;
  await sql`delete from monthly_trend`;
  await sql`delete from forecast_table`;
  await sql`delete from alerts`;
  await sql`delete from uploads`;
  await sql`delete from app_settings`;

  for (const e of estates) {
    await sql`
      insert into estates (id, nama, luas_tm, ton, ton_per_ha, ach_budget, kec_tk, hke, restan)
      values (${e.id}, ${e.nama}, ${e.luasTM}, ${e.ton}, ${e.tonPerHa}, ${e.achBudget}, ${e.kecTK}, ${e.hke}, ${e.restan})
    `;
  }

  for (const d of divisions) {
    await sql`
      insert into divisions (id, estate, divisi, luas_tm, akp, bjr, rotasi_rencana, kebutuhan, tersedia, hke)
      values (${d.id}, ${d.estate}, ${d.divisi}, ${d.luasTM}, ${d.akp}, ${d.bjr}, ${d.rotasiRencana}, ${d.kebutuhan}, ${d.tersedia}, ${d.hke})
    `;
  }

  for (let i = 0; i < monthlyTrend.length; i++) {
    const m = monthlyTrend[i];
    await sql`
      insert into monthly_trend (urutan, bulan, aktual, budget, forecast)
      values (${i}, ${m.bulan}, ${m.aktual}, ${m.budget}, ${m.forecast})
    `;
  }

  for (let i = 0; i < forecastTable.length; i++) {
    const f = forecastTable[i];
    await sql`
      insert into forecast_table (urutan, bulan, indeks_musiman, janjang_rb, bjr, ton, ton_per_ha, vs_budget)
      values (${i}, ${f.bulan}, ${f.indeksMusiman}, ${f.janjangRb}, ${f.bjr}, ${f.ton}, ${f.tonPerHa}, ${f.vsBudget})
    `;
  }

  for (let i = 0; i < alerts.length; i++) {
    const a = alerts[i];
    await sql`
      insert into alerts (urutan, level, kicker, text, detail, link_label, href)
      values (${i}, ${a.level}, ${a.kicker}, ${a.text}, ${a.detail}, ${a.linkLabel}, ${a.href})
    `;
  }

  for (const u of uploads) {
    await sql`
      insert into uploads (nama, jenis, periode, baris, tanggal, pengunggah, status)
      values (${u.nama}, ${u.jenis}, ${u.periode}, ${u.baris}, ${u.tanggal}, ${u.pengunggah}, ${u.status})
    `;
  }

  const settings: Array<[string, unknown]> = [
    ["periode", periode],
    ["hierarki", hierarki],
    ["estateTotal", estateTotal],
    ["kecukupanTotal", kecukupanTotal],
    ["kecukupanMonthly", kecukupanMonthly],
    ["kecukupanBaseline", kecukupanBaseline],
    ["accuracy", accuracy],
  ];
  for (const [key, value] of settings) {
    await sql`insert into app_settings (key, value) values (${key}, ${JSON.stringify(value)})`;
  }

  console.log("Seed selesai:", {
    estates: estates.length,
    divisions: divisions.length,
    monthlyTrend: monthlyTrend.length,
    forecastTable: forecastTable.length,
    alerts: alerts.length,
    uploads: uploads.length,
    settings: settings.length,
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
