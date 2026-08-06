import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function TurnOverPemanenPage() {
  return (
    <PlaceholderPage
      title="Turn Over Pemanen"
      tagline="Berapa banyak pemanen yang keluar, kenapa, dan berapa yang harus direkrut supaya panen tidak terganggu."
      bullets={[
        "Kartu KPI: TO bulan ini · TO tahunan · Masuk · Keluar · Net Growth · Early TO",
        "Tren garis 24 bulan dengan garis ambang batas",
        "Donat alasan keluar + batang masa kerja saat keluar",
        "Tabel peringkat Divisi TO tertinggi, kolom \"Dampak\" (gap pemanen)",
        "Panel kaitan: TO % vs Restan / Ach Budget %",
        "Tabel detail karyawan keluar",
      ]}
    />
  );
}
