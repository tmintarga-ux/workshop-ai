"use client";

import { useState } from "react";
import type { Semaphore } from "@/lib/data";

export function FormulaTooltip({ formula }: { formula: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="tooltip-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="info-dot"
        aria-label="Lihat rumus"
        onClick={() => setOpen((o) => !o)}
      >
        ?
      </button>
      {open && (
        <span className="tooltip-pop" role="tooltip">
          <span className="tooltip-pop-formula">Rumus &amp; sumber data</span>
          {formula}
        </span>
      )}
    </span>
  );
}

const toneClass: Record<Semaphore, string> = {
  merah: "tone-red",
  kuning: "tone-yellow",
  hijau: "tone-green",
};

export function KpiCard({
  label,
  value,
  unit,
  tone,
  compareText,
  note,
  formula,
}: {
  label: string;
  value: string;
  unit?: string;
  tone?: Semaphore;
  compareText?: string;
  note?: string;
  formula?: string;
}) {
  return (
    <div className={`kpi-card${tone ? ` ${toneClass[tone]}` : ""}`}>
      <div className="kpi-label">
        {label}
        {formula && <FormulaTooltip formula={formula} />}
      </div>
      <div className="kpi-value-row">
        <span className={`kpi-value${tone === "merah" ? " tone-red" : ""}`}>{value}</span>
        {unit && <span className="kpi-unit">{unit}</span>}
      </div>
      {compareText && <div className={`kpi-compare${tone ? ` ${toneClass[tone]}` : ""}`}>{compareText}</div>}
      {note && <div className="kpi-note">{note}</div>}
    </div>
  );
}

export function Pill({ value, semaphore, solid }: { value: string; semaphore: Semaphore; solid?: boolean }) {
  const cls = solid && semaphore === "merah" ? "pill-red-solid" : semaphore === "merah" ? "pill-red" : semaphore === "kuning" ? "pill-yellow" : "pill-green";
  return <span className={`pill ${cls}`}>{value}</span>;
}

export function Badge({ level }: { level: "merah" | "kuning" }) {
  return <span className={`badge badge-${level}`}>{level === "merah" ? "Merah" : "Kuning"}</span>;
}
