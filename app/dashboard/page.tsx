"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { AlertPanel } from "@/components/AlertPanel";
import { KpiCard, Pill } from "@/components/Kpi";
import { TrendChart } from "@/components/charts/TrendChart";
import { useFilters } from "@/lib/filters";
import {
  alerts,
  estateTotal,
  estates,
  formulaKpi,
  monthlyTrend,
  periode,
  semaphoreAchBudget,
  semaphoreHKE,
  semaphoreKecukupanTK,
  thresholds,
  uploads,
} from "@/lib/data";
import { fmtDec, fmtInt } from "@/lib/format";

function toneLabel(semaphore: "merah" | "kuning" | "hijau", thresholdRow: (typeof thresholds)[number]) {
  const cap = semaphore === "merah" ? "Merah" : semaphore === "kuning" ? "Kuning" : "Hijau";
  const range = semaphore === "merah" ? thresholdRow.merah : semaphore === "kuning" ? thresholdRow.kuning : thresholdRow.hijau;
  return `${cap} · ambang ${range}`;
}

export default function DashboardPage() {
  const { estateId } = useFilters();
  const selected = estateId === "all" ? null : estates.find((e) => e.id === estateId);

  const produksi = selected ? selected.ton : estateTotal.ton;
  const achBudget = selected ? selected.achBudget : estateTotal.achBudget;
  const kecTK = selected ? selected.kecTK : estateTotal.kecTK;
  const hke = selected ? selected.hke : estateTotal.hke;
  const achForecast = 103.4;

  const tAchBudget = semaphoreAchBudget(achBudget);
  const tAchForecast = semaphoreAchBudget(achForecast);
  const tKecTK = semaphoreKecukupanTK(kecTK);
  const tHke = semaphoreHKE(hke);

  const scopeLabel = selected ? selected.nama : "Reg 8A";

  return (
    <AppShell title="Dashboard">
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 29, lineHeight: 1.15 }}>Selamat pagi, Rangga</div>
          <div style={{ fontSize: 14.5, color: "var(--color-neutral-700)", marginTop: 3 }}>
            Data {periode.aktif} sudah lengkap untuk {scopeLabel}. Dua hal butuh keputusan minggu ini.
          </div>
        </div>
        <div className="btn-row">
          <button type="button" className="btn btn-outline">
            Ekspor Excel
          </button>
          <button type="button" className="btn btn-primary">
            Ekspor PDF
          </button>
        </div>
      </div>

      <AlertPanel alerts={alerts} note="ambang batas dari Pengaturan" />

      <div className="kpi-grid">
        <KpiCard label="Produksi" value={fmtInt(produksi)} unit="Ton" compareText="▲ 8,0% vs Jun" tone="hijau" formula={formulaKpi.produksi} />
        <KpiCard
          label="Ach. Budget"
          value={fmtDec(achBudget)}
          unit="%"
          tone={tAchBudget}
          compareText={toneLabel(tAchBudget, thresholds[0])}
          formula={formulaKpi.achBudget}
        />
        <KpiCard
          label="Ach. Forecast"
          value={fmtDec(achForecast)}
          unit="%"
          tone={tAchForecast}
          compareText="Hijau · deviasi +3,4%"
          formula={formulaKpi.achForecast}
        />
        <KpiCard
          label="Kecukupan TK"
          value={fmtDec(kecTK)}
          unit="%"
          tone={tKecTK}
          compareText={toneLabel(tKecTK, thresholds[1])}
          formula={formulaKpi.kecukupanTk}
        />
        <KpiCard label="HKE" value={fmtDec(hke)} unit="%" tone={tHke} compareText={toneLabel(tHke, thresholds[2])} formula={formulaKpi.hke} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 470px", gap: 16, flex: 1, minHeight: 0 }} className="dashboard-lower">
        <div className="card">
          <div className="section-heading-row">
            <span className="card-heading">Tren 12 bulan — Aktual vs Budget vs Forecast</span>
            <span className="legend">
              <span className="legend-item">
                <span className="legend-swatch-block" style={{ background: "var(--color-accent-2-500)" }} />
                Aktual
              </span>
              <span className="legend-item">
                <span className="legend-swatch-line" style={{ background: "var(--color-accent-600)" }} />
                Budget
              </span>
              <span className="legend-item">
                <span className="legend-swatch-dashed" />
                Forecast
              </span>
            </span>
          </div>
          <TrendChart data={monthlyTrend} />
        </div>

        <div className="card" style={{ minHeight: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span className="card-heading">Peringkat Estate</span>
            <span style={{ fontSize: 12.5, color: "var(--color-neutral-700)" }}>Luas TM = 0 dikecualikan</span>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="col-label">Estate</th>
                  <th>Ton</th>
                  <th>Ach. Bdg</th>
                  <th>Kec. TK</th>
                  <th>HKE</th>
                </tr>
              </thead>
              <tbody className="tabular">
                {estates.map((e) => (
                  <tr key={e.id} className={selected?.id === e.id ? "row-flagged" : undefined}>
                    <td className="col-label">{e.nama}</td>
                    <td>{fmtInt(e.ton)}</td>
                    <td>
                      <Pill value={fmtDec(e.achBudget)} semaphore={semaphoreAchBudget(e.achBudget)} />
                    </td>
                    <td>
                      <Pill value={fmtDec(e.kecTK)} semaphore={semaphoreKecukupanTK(e.kecTK)} />
                    </td>
                    <td>
                      <Pill value={fmtDec(e.hke)} semaphore={semaphoreHKE(e.hke)} />
                    </td>
                  </tr>
                ))}
                <tr className="row-total">
                  <td className="col-label">{estateTotal.nama}</td>
                  <td>{fmtInt(estateTotal.ton)}</td>
                  <td>{fmtDec(estateTotal.achBudget)}</td>
                  <td>{fmtDec(estateTotal.kecTK)}</td>
                  <td>{fmtDec(estateTotal.hke)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "auto", borderTop: "1px solid var(--color-divider)", paddingTop: 11, display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ fontSize: 11.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-neutral-600)", fontWeight: 700 }}>
              Unggahan terakhir
            </div>
            {uploads.map((u) => (
              <div className="upload-row" key={u.nama}>
                <span className={`upload-dot ${u.status === "warn" ? "warn" : "ok"}`} />
                {u.nama}
                <span className="upload-meta">
                  {u.tanggal} · {u.status === "warn" ? "Perlu diperiksa ⚠" : "Diproses ✓"}
                </span>
              </div>
            ))}
            <Link href="/pusat-data" style={{ fontSize: 13, fontWeight: 700 }}>
              Buka Pusat Data →
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
