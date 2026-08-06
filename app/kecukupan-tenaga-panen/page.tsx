"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { KpiCard, Pill } from "@/components/Kpi";
import { ProjectionChart } from "@/components/charts/ProjectionChart";
import { Slider } from "@/components/Slider";
import { useFilters } from "@/lib/filters";
import { divisions, formulaKpi, kecukupanBaseline, kecukupanMonthly, semaphoreKecukupanTK } from "@/lib/data";
import { fmtDec, fmtInt } from "@/lib/format";

type SortKey = "divisi" | "luasTM" | "kebutuhan" | "tersedia" | "gap" | "kecukupan";

export default function KecukupanTenagaPanenPage() {
  const { estateId, divisiId } = useFilters();
  const [basisBorong, setBasisBorong] = useState(kecukupanBaseline.basisBorong);
  const [rotasiRencana, setRotasiRencana] = useState(kecukupanBaseline.rotasiRencana);
  const [hke, setHke] = useState(kecukupanBaseline.hke);
  const [jumlahPemanen, setJumlahPemanen] = useState(kecukupanBaseline.jumlahPemanen);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "kecukupan", dir: 1 });

  const kebutuhan = Math.round(
    kecukupanBaseline.kebutuhan * (kecukupanBaseline.basisBorong / basisBorong) * (kecukupanBaseline.rotasiRencana / rotasiRencana)
  );
  const efektif = Math.round(jumlahPemanen * (hke / 100));
  const gap = kebutuhan - efektif;
  const potensiTon = Math.round(Math.max(gap, 0) * basisBorong * rotasiRencana) / 1000;
  const rotasiAktual = Math.round(rotasiRencana * (kebutuhan / efektif) * 1.111 * 10) / 10;

  const kebutuhanRatio = kebutuhan / kecukupanBaseline.kebutuhan;
  const efektifRatio = efektif / kecukupanBaseline.efektif;
  // Kecukupan% dijaga anchor ke baseline mockup (78,9%) lalu diskalakan proporsional
  // terhadap perubahan slider, alih-alih efektif/kebutuhan mentah (yang punya
  // pembulatan berbeda di sumber aslinya).
  const kecukupan = Math.round(kecukupanBaseline.kecukupan * (efektifRatio / kebutuhanRatio) * 10) / 10;
  const scaledKebutuhan = kecukupanMonthly.kebutuhan.map((v) => Math.round(v * kebutuhanRatio));
  const scaledTersedia = kecukupanMonthly.tersediaEfektif.map((v) => Math.round(v * efektifRatio));

  const tKecukupan = semaphoreKecukupanTK(kecukupan);
  const tRotasi = rotasiAktual > rotasiRencana + 0.5 ? "kuning" : "hijau";

  const filteredDivisions = useMemo(() => {
    let rows = divisions;
    if (divisiId !== "all") {
      rows = rows.filter((d) => d.id === divisiId);
    } else if (estateId !== "all") {
      const estateName = { "sungai-bahar": "Sungai Bahar", "lubuk-tapang": "Lubuk Tapang", "tanjung-rambang": "Tanjung Rambang", "muara-kandis": "Muara Kandis", "bukit-sanggul": "Bukit Sanggul" }[estateId];
      rows = rows.filter((d) => d.estate === estateName);
    }
    const sorted = [...rows].sort((a, b) => {
      const av = sort.key === "divisi" ? `${a.estate} ${a.divisi}` : a[sort.key];
      const bv = sort.key === "divisi" ? `${b.estate} ${b.divisi}` : b[sort.key];
      if (typeof av === "string") return av.localeCompare(bv as string) * sort.dir;
      return ((av as number) - (bv as number)) * sort.dir;
    });
    return sorted;
  }, [estateId, divisiId, sort]);

  const toggleSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: 1 }));

  const totalLuasTM = filteredDivisions.reduce((s, d) => s + d.luasTM, 0);
  const totalKebutuhan = filteredDivisions.reduce((s, d) => s + d.kebutuhan, 0);
  const totalTersedia = filteredDivisions.reduce((s, d) => s + d.tersedia, 0);
  const totalEfektif = filteredDivisions.reduce((s, d) => s + d.efektif, 0);
  const totalGap = totalKebutuhan - totalEfektif;
  const totalKecukupan = Math.round((totalEfektif / totalKebutuhan) * 1000) / 10;

  return (
    <AppShell title="Kecukupan Tenaga Panen">
      <div className="kpi-grid">
        <KpiCard label="Kecukupan TK" value={fmtDec(kecukupan)} unit="%" tone={tKecukupan} compareText={`${tKecukupan === "merah" ? "Merah" : tKecukupan === "kuning" ? "Kuning" : "Hijau"} · ambang < 80%`} formula={formulaKpi.kecukupanTk} />
        <KpiCard label="Kebutuhan" value={fmtInt(kebutuhan)} unit="orang" note={`rotasi ${fmtDec(rotasiRencana, 0)} hari · basis ${fmtInt(basisBorong)} kg`} />
        <KpiCard label="Tersedia" value={fmtInt(jumlahPemanen)} unit="orang" note={`efektif ${fmtInt(efektif)} (HKE ${fmtDec(hke)}%)`} />
        <KpiCard label="Gap" value={fmtInt(gap)} unit="orang" tone={gap > 0 ? "merah" : "hijau"} note={`potensi ${fmtInt(potensiTon)} ton tertunda`} formula={formulaKpi.gap} />
        <KpiCard label="Rotasi aktual" value={fmtDec(rotasiAktual)} unit="hari" tone={tRotasi} note={`rencana ${fmtDec(rotasiRencana, 0)} hari`} formula={formulaKpi.rotasiAktual} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 366px", gap: 16, flex: 1, minHeight: 0 }} className="kecukupan-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minHeight: 0 }}>
          <div className="card" style={{ flex: "none", height: 328 }}>
            <div className="section-heading-row">
              <span className="card-heading">Proyeksi 12 bulan — kebutuhan vs ketersediaan pemanen</span>
              <span className="legend">
                <span className="legend-item">
                  <span className="legend-swatch-block" style={{ background: "var(--color-accent-2-500)" }} />
                  Kebutuhan
                </span>
                <span className="legend-item">
                  <span className="legend-swatch-line" style={{ background: "var(--color-accent-600)" }} />
                  Tersedia efektif
                </span>
                <span className="legend-item">
                  <span className="legend-swatch-block" style={{ background: "var(--color-hatch)" }} />
                  Kekurangan
                </span>
              </span>
            </div>
            <ProjectionChart bulan={kecukupanMonthly.bulan} kebutuhan={scaledKebutuhan} tersedia={scaledTersedia} />
          </div>

          <div className="card" style={{ flex: 1, minHeight: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <span className="card-heading">Per Divisi</span>
              <span style={{ fontSize: 12.5, color: "var(--color-neutral-600)" }}>header &amp; kolom pertama lengket · klik header untuk urutkan</span>
            </div>
            <div className="table-scroll">
              <table className="data-table data-table-wide">
                <thead>
                  <tr>
                    <th className="col-label col-sticky" onClick={() => toggleSort("divisi")} style={{ cursor: "pointer" }}>
                      Estate / Divisi
                    </th>
                    <th onClick={() => toggleSort("luasTM")} style={{ cursor: "pointer" }}>Luas TM</th>
                    <th>AKP</th>
                    <th>BJR</th>
                    <th>Rot.</th>
                    <th onClick={() => toggleSort("kebutuhan")} style={{ cursor: "pointer" }}>Kebut.</th>
                    <th onClick={() => toggleSort("tersedia")} style={{ cursor: "pointer" }}>Tersedia</th>
                    <th>HKE%</th>
                    <th>Efektif</th>
                    <th onClick={() => toggleSort("gap")} style={{ cursor: "pointer" }}>Gap</th>
                    <th onClick={() => toggleSort("kecukupan")} style={{ cursor: "pointer" }}>Kecukupan</th>
                  </tr>
                </thead>
                <tbody className="tabular">
                  {filteredDivisions.map((d) => (
                    <tr key={d.id} className={d.kecukupan < 80 ? "row-flagged" : undefined}>
                      <td className="col-label col-sticky">
                        {d.estate} · {d.divisi}
                      </td>
                      <td>{fmtInt(d.luasTM)}</td>
                      <td>{fmtDec(d.akp, 2)}</td>
                      <td>{fmtDec(d.bjr, 2)}</td>
                      <td>{d.rotasiRencana}</td>
                      <td>{fmtInt(d.kebutuhan)}</td>
                      <td>{fmtInt(d.tersedia)}</td>
                      <td>{fmtDec(d.hke)}</td>
                      <td>{fmtInt(d.efektif)}</td>
                      <td style={d.gap > 0 ? { fontWeight: 700, color: "var(--color-red-text)" } : undefined}>{d.gap > 0 ? `+${d.gap}` : d.gap}</td>
                      <td>
                        <Pill value={fmtDec(d.kecukupan)} semaphore={semaphoreKecukupanTK(d.kecukupan)} solid={d.kecukupan < 80} />
                      </td>
                    </tr>
                  ))}
                  <tr className="row-total">
                    <td className="col-label col-sticky">Total terpilih</td>
                    <td>{fmtInt(totalLuasTM)}</td>
                    <td>–</td>
                    <td>–</td>
                    <td>–</td>
                    <td>{fmtInt(totalKebutuhan)}</td>
                    <td>{fmtInt(totalTersedia)}</td>
                    <td>–</td>
                    <td>{fmtInt(totalEfektif)}</td>
                    <td>{totalGap}</td>
                    <td>{fmtDec(totalKecukupan)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: "auto", fontSize: 12, color: "var(--color-neutral-600)" }}>
              {filteredDivisions.length} dari {divisions.length} divisi ditampilkan · baris Luas TM = 0 dikecualikan dari rata-rata &amp; peringkat
            </div>
          </div>
        </div>

        {/* what-if */}
        <div style={{ background: "var(--color-accent-2-100)", border: "1px solid var(--color-accent-2-300)", borderRadius: 24, padding: 20, display: "flex", flexDirection: "column", gap: 15, minHeight: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span className="card-heading">Simulasi what-if</span>
            <span style={{ fontSize: 13, color: "var(--color-neutral-700)" }}>Geser — semua angka hitung ulang seketika.</span>
          </div>

          <Slider label="Basis borong" valueLabel={`${fmtInt(basisBorong)} kg/HK`} value={basisBorong} min={700} max={1500} step={10} onChange={setBasisBorong} minLabel="700" maxLabel="1.500" />
          <Slider label="Rotasi panen" valueLabel={`${rotasiRencana} hari`} value={rotasiRencana} min={5} max={15} step={1} onChange={setRotasiRencana} minLabel="5" maxLabel="15" />
          <Slider label="HKE" valueLabel={`${fmtDec(hke)} %`} value={hke} min={70} max={100} step={0.5} onChange={setHke} minLabel="70%" maxLabel="100%" />
          <Slider label="Jumlah pemanen" valueLabel={`${jumlahPemanen} orang`} value={jumlahPemanen} min={250} max={450} step={1} onChange={setJumlahPemanen} minLabel="250" maxLabel="450" />

          <div style={{ background: "var(--color-neutral-100)", borderRadius: 18, padding: "15px 16px", display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ fontSize: 11.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-neutral-600)", fontWeight: 700 }}>Hasil simulasi</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13.5 }}>Kecukupan TK</span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: 24, color: tKecukupan === "merah" ? "var(--color-red-text)" : undefined }}>{fmtDec(kecukupan)}%</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13.5 }}>Gap</span>
              <span style={{ fontWeight: 700, fontSize: 16 }}>{gap > 0 ? gap : 0} orang</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13.5 }}>Potensi ton tertunda</span>
              <span style={{ fontWeight: 700, fontSize: 16 }}>{fmtInt(potensiTon)} Ton</span>
            </div>
            <div style={{ borderTop: "1px solid var(--color-divider)", paddingTop: 9, fontSize: 12.5, color: "var(--color-neutral-700)", lineHeight: 1.45 }}>
              {simInsight(kebutuhan, efektif, hke)}
            </div>
          </div>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 9 }}>
            <button type="button" className="btn btn-primary">
              Kirim ke Rencana Rekrutmen
            </button>
            <div className="btn-row">
              <button type="button" className="btn btn-outline btn-sm">
                Ekspor Excel
              </button>
              <button type="button" className="btn btn-outline btn-sm">
                Ekspor PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function simInsight(kebutuhan: number, efektif: number, hke: number) {
  const gap = kebutuhan - efektif;
  if (gap <= 0) return "Pemanen efektif sudah menutup kebutuhan — tidak ada gap pada skenario ini.";
  const hke92Efektif = Math.round(efektif * (92 / hke));
  const closed = Math.min(gap, Math.max(0, hke92Efektif - efektif));
  if (closed > 0) {
    return `Menaikkan HKE ke 92% saja menutup ${closed} dari ${gap} orang — lebih murah daripada rekrut.`;
  }
  return `Gap ${gap} orang perlu ditutup lewat rekrutmen atau penyesuaian rotasi.`;
}
