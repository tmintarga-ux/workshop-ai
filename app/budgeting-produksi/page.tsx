import { PlaceholderPage } from "@/components/PlaceholderPage";

export default function BudgetingProduksiPage() {
  return (
    <PlaceholderPage
      title="Budgeting Produksi"
      tagline="Menyusun budget tahunan yang bisa dipertanggungjawabkan, membaginya ke bulan, lalu memantau pencapaiannya."
      bullets={[
        "Tiga skenario dalam tab: Konservatif / Moderat / Optimis",
        "Tabel budget editable per Divisi — total menghitung ulang seketika ke Estate → Region → MDO",
        "Grafik batang bertumpuk 12 bulan: Budget vs Aktual vs Latest Estimate",
        "Heatmap pencapaian Estate/Divisi × bulan",
        "Uji kewajaran: kapasitas panen, BJR wajar, lonjakan Ton/Ha > 15%",
        "Riwayat revisi budget",
      ]}
    />
  );
}
