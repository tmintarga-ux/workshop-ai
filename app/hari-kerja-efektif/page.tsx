import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function HariKerjaEfektifPage() {
  return (
    <PlaceholderPage
      title="Hari Kerja Efektif"
      tagline="Dari hari kerja yang tersedia, berapa yang benar-benar dipakai memanen — dan berapa ton yang hilang karena sisanya."
      bullets={[
        "Kartu KPI: HKE % · HK Tersedia · HK Efektif · HK Hilang · Potensi Ton Hilang · Produktivitas",
        "Batang bertumpuk 12 bulan: Efektif / Mangkir / Sakit-Izin-Cuti / Hujan / Non-panen, garis HKE % di sumbu kanan",
        "Kalender panas — kotak harian sebulan berwarna HKE, hari hujan diberi ikon",
        "Scatter HKE % vs Ach Budget % per Divisi + garis kecenderungan",
        "Tabel Divisi HKE terendah",
      ]}
    />
  );
}
