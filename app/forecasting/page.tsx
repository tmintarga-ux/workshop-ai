"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { Pill } from "@/components/Kpi";
import { ForecastChart, type ForecastPoint } from "@/components/charts/ForecastChart";
import { Sparkline } from "@/components/charts/Sparkline";
import { Slider } from "@/components/Slider";
import {
  semaphoreAchBudget,
  type Accuracy,
  type BulanTrend,
  type ForecastRow,
  type KecukupanTotal,
} from "@/lib/data";
import { fmtDec, fmtInt } from "@/lib/format";

const METHODS = [
  { id: "sensus", title: "Sensus Buah", desc: "AKP × SPH × Luas TM → janjang" },
  { id: "tren", title: "Tren + Musiman", desc: "Basis tahunan × indeks musiman bulan-m" },
  { id: "umur", title: "Potensi Umur Tanaman", desc: "Standar yield per umur & kelas lahan" },
] as const;

const HORIZONS = [3, 6, 12] as const;
const BASE_FACTOR = 0.94;

type ForecastingData = {
  forecastTable: ForecastRow[];
  monthlyTrend: BulanTrend[];
  accuracy: Accuracy;
  kecukupanTotal: KecukupanTotal;
};

export default function ForecastingPage() {
  const [data, setData] = useState<ForecastingData | null>(null);
  const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("tren");
  const [horizon, setHorizon] = useState<(typeof HORIZONS)[number]>(6);
  const [factor, setFactor] = useState(BASE_FACTOR);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/forecasting")
      .then((res) => res.json())
      .then((d) => {
        if (!cancelled) setData(d);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const forecastTable = useMemo(() => data?.forecastTable ?? [], [data]);
  const monthlyTrend = useMemo(() => data?.monthlyTrend ?? [], [data]);
  const accuracy = data?.accuracy ?? null;
  const kecukupanTotal = data?.kecukupanTotal ?? null;

  const budgetForForecast: (number | null)[] = useMemo(
    () => [...monthlyTrend.slice(7, 12).map((m) => m.budget), null, null, null, null, null, null],
    [monthlyTrend]
  );

  const scaledRows = useMemo(() => {
    if (!kecukupanTotal) return [];
    const ratio = factor / BASE_FACTOR;
    return forecastTable.slice(0, horizon).map((row, i) => {
      const ton = Math.round(row.ton * ratio);
      const janjangRb = Math.round(row.janjangRb * ratio);
      const tonPerHa = Math.round((ton / kecukupanTotal.luasTM) * 100) / 100;
      const budget = budgetForForecast[i];
      const vsBudget = budget ? Math.round((ton / budget) * 1000) / 10 : null;
      return { ...row, ton, janjangRb, tonPerHa, vsBudget };
    });
  }, [factor, horizon, forecastTable, kecukupanTotal, budgetForForecast]);

  const totals = scaledRows.reduce(
    (acc, r) => ({
      indeksMusiman: acc.indeksMusiman + r.indeksMusiman,
      janjangRb: acc.janjangRb + r.janjangRb,
      ton: acc.ton + r.ton,
      tonPerHa: acc.tonPerHa + r.tonPerHa,
    }),
    { indeksMusiman: 0, janjangRb: 0, ton: 0, tonPerHa: 0 }
  );
  const avgBjr = scaledRows.length ? scaledRows.reduce((s, r) => s + r.bjr, 0) / scaledRows.length : 0;
  const avgVsBudget = (() => {
    const withBudget = scaledRows.filter((r) => r.vsBudget != null) as (typeof scaledRows[number] & { vsBudget: number })[];
    if (!withBudget.length) return null;
    return withBudget.reduce((s, r) => s + r.vsBudget, 0) / withBudget.length;
  })();

  const chartPoints: ForecastPoint[] = useMemo(() => {
    const actualMonths = monthlyTrend.slice(0, 7).map((m) => ({ label: m.bulan, actual: m.aktual, forecast: null as number | null }));
    const forecastMonths = scaledRows.map((r) => ({ label: shortLabel(r.bulan), actual: null as number | null, forecast: r.ton }));
    // sambungkan garis forecast dari titik aktual terakhir
    if (forecastMonths.length) {
      actualMonths[actualMonths.length - 1] = { ...actualMonths[actualMonths.length - 1], forecast: actualMonths[actualMonths.length - 1].actual };
    }
    return [...actualMonths, ...forecastMonths];
  }, [scaledRows, monthlyTrend]);

  const deltaPct = Math.round((1 - factor) * 100);
  const factorNote =
    deltaPct > 0
      ? `Menurunkan proyeksi ${deltaPct}% untuk restan & buah tinggal — sesuai rata-rata 3 tahun.`
      : "Tidak ada koreksi turun — proyeksi memakai angka mentah model.";

  if (!data || !accuracy || !kecukupanTotal) {
    return (
      <AppShell title="Forecasting Produksi" sidebarFooter="histori">
        <div className="card empty-state" style={{ flex: 1 }}>
          <div className="empty-state-title">Memuat data dari database…</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Forecasting Produksi" sidebarFooter="histori">
      <div style={{ display: "grid", gridTemplateColumns: "314px 1fr", gap: 16, flex: 1, minHeight: 0 }} className="forecasting-grid">
        {/* panel kiri */}
        <div style={{ background: "var(--color-neutral-200)", borderRadius: 24, padding: "22px 20px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ fontSize: 11.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-neutral-600)", fontWeight: 700 }}>Metode</div>
            {METHODS.map((m) => {
              const active = method === m.id;
              return (
                <button key={m.id} type="button" className={`option-card${active ? " is-active" : ""}`} onClick={() => setMethod(m.id)}>
                  <span className="option-radio-dot">{active && <span className="option-radio-dot-fill" />}</span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span className="option-title">{m.title}</span>
                    <span className="option-desc">{m.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ fontSize: 11.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-neutral-600)", fontWeight: 700 }}>Horizon</div>
            <div className="seg-control">
              {HORIZONS.map((h) => (
                <button key={h} type="button" className={`seg-btn${horizon === h ? " is-active" : ""}`} onClick={() => setHorizon(h)}>
                  {h} bln
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Slider
              label="Faktor koreksi"
              valueLabel={fmtDec(factor, 2)}
              value={factor}
              min={0.85}
              max={1.0}
              step={0.01}
              onChange={setFactor}
              minLabel="0,85"
              maxLabel="1,00"
            />
            <div style={{ fontSize: 12.5, color: "var(--color-neutral-700)", lineHeight: 1.45 }}>{factorNote}</div>
          </div>

          <div style={{ background: "var(--color-neutral-100)", borderRadius: 18, padding: "14px 15px", display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 11.5, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-neutral-600)", fontWeight: 700 }}>
              Akurasi 12 bulan lalu
            </div>
            <div style={{ display: "flex", gap: 18 }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 12.5, color: "var(--color-neutral-700)" }}>MAPE</span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 26, lineHeight: 1.1 }}>{fmtDec(accuracy.mape)}%</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 12.5, color: "var(--color-neutral-700)" }}>Bias</span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 26, lineHeight: 1.1 }}>+{fmtDec(accuracy.bias)}%</span>
              </div>
            </div>
            <Sparkline aktual={accuracy.aktual} forecast={accuracy.forecast} />
            <div style={{ fontSize: 12, color: "var(--color-neutral-600)" }}>Hijau aktual · terakota forecast</div>
          </div>

          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 9 }}>
            <button type="button" className="btn btn-primary">
              Jadikan dasar Budget
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

        {/* kanan */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
          <div className="card" style={{ flex: "none" }}>
            <div className="section-heading-row">
              <span className="card-heading">Proyeksi TBS — Reg 8A, {horizon} bulan ke depan</span>
              <span className="legend">
                <span className="legend-item">
                  <span className="legend-swatch-line" style={{ background: "var(--color-accent-2-600)" }} />
                  Aktual
                </span>
                <span className="legend-item">
                  <span className="legend-swatch-dashed" style={{ borderTopColor: "var(--color-accent-600)" }} />
                  Forecast
                </span>
                <span className="legend-item">
                  <span className="legend-swatch-block" style={{ background: "var(--color-accent-300)", opacity: 0.6 }} />
                  Pita kepercayaan
                </span>
              </span>
            </div>
            <ForecastChart points={chartPoints} />
          </div>

          <div className="card" style={{ flex: 1, minHeight: 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <span className="card-heading">Forecast bulanan</span>
              <span style={{ fontSize: 12.5, color: "var(--color-neutral-600)" }}>
                metode: {METHODS.find((m) => m.id === method)?.title} · faktor koreksi {fmtDec(factor, 2)}
              </span>
              <span style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 600, color: "var(--color-accent-700)" }}>Lihat baris data sumber</span>
            </div>
            <div className="table-scroll">
              <table className="data-table data-table-wide">
                <thead>
                  <tr>
                    <th className="col-label">Bulan</th>
                    <th>Indeks musiman</th>
                    <th>Janjang (rb)</th>
                    <th>BJR</th>
                    <th>Ton</th>
                    <th>Ton/Ha</th>
                    <th>vs Budget</th>
                  </tr>
                </thead>
                <tbody className="tabular">
                  {scaledRows.map((r) => (
                    <tr key={r.bulan}>
                      <td className="col-label">{r.bulan}</td>
                      <td>{fmtDec(r.indeksMusiman)}%</td>
                      <td>{fmtInt(r.janjangRb)}</td>
                      <td>{fmtDec(r.bjr, 2)}</td>
                      <td style={{ fontWeight: 700 }}>{fmtInt(r.ton)}</td>
                      <td>{fmtDec(r.tonPerHa, 2)}</td>
                      <td>{r.vsBudget != null ? <Pill value={fmtDec(r.vsBudget)} semaphore={semaphoreAchBudget(r.vsBudget)} /> : <span style={{ color: "var(--color-neutral-600)" }}>belum ada</span>}</td>
                    </tr>
                  ))}
                  <tr className="row-total">
                    <td className="col-label">Total {horizon} bulan</td>
                    <td>{fmtDec(totals.indeksMusiman)}%</td>
                    <td>{fmtInt(totals.janjangRb)}</td>
                    <td>{fmtDec(avgBjr, 2)}</td>
                    <td>{fmtInt(totals.ton)}</td>
                    <td>{fmtDec(totals.tonPerHa, 2)}</td>
                    <td>{avgVsBudget != null ? fmtDec(avgVsBudget) : "–"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10, background: "var(--color-accent-2-100)", border: "1px solid var(--color-accent-2-300)", borderRadius: 16, padding: "11px 14px", flexWrap: "wrap" }}>
              <span style={{ fontSize: 13.5, lineHeight: 1.4 }}>
                Puncak forecast September ({fmtInt(scaledRows[1]?.ton ?? forecastTable[1].ton)} Ton) bertepatan dengan gap pemanen 100 orang. Angka ini hanya tercapai bila rekrutmen selesai sebelum Agustus.
              </span>
              <Link href="/kecukupan-tenaga-panen" style={{ marginLeft: "auto", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap" }}>
                Buka Kecukupan TK →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function shortLabel(full: string) {
  const map: Record<string, string> = {
    Agustus: "Ags",
    September: "Sep",
    Oktober: "Okt",
    November: "Nov",
    Desember: "Des",
    Januari: "Jan",
    Februari: "Feb",
    Maret: "Mar",
    April: "Apr",
    Mei: "Mei",
    Juni: "Jun",
    Juli: "Jul",
  };
  const [bulan, tahun] = full.split(" ");
  return `${map[bulan] ?? bulan}${tahun.slice(2)}`;
}
