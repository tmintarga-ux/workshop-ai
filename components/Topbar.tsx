"use client";

import { useFilters, useEstateOptions, useDivisiOptions, usePeriodOptions, useHierarki } from "@/lib/filters";
import { useTheme } from "@/lib/theme";
import { IconMenu, IconSun, IconMoon } from "./icons";

function initialsFrom(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Topbar({ title, onOpenMobile }: { title: string; onOpenMobile: () => void }) {
  const { estateId, divisiId, period, setEstateId, setDivisiId, setPeriod, reset, activeCount } = useFilters();
  const estateOptions = useEstateOptions();
  const divisiOptions = useDivisiOptions(estateId);
  const periodOptions = usePeriodOptions();
  const hierarki = useHierarki();
  const { theme, toggle } = useTheme();

  return (
    <div className="topbar">
      <button type="button" className="sidebar-mobile-toggle" onClick={onOpenMobile} aria-label="Buka menu">
        <IconMenu />
      </button>
      <div className="topbar-title">{title}</div>

      <div className="topbar-filters">
        <span className="filter-pill">{hierarki.mdo}</span>
        <span className="filter-sep">›</span>
        <span className="filter-pill">{hierarki.region}</span>
        <span className="filter-sep">›</span>
        <select
          className="filter-pill"
          value={estateId}
          onChange={(e) => setEstateId(e.target.value)}
          aria-label="Filter Estate"
        >
          {estateOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.nama}
            </option>
          ))}
        </select>
        <span className="filter-sep">›</span>
        <select
          className="filter-pill"
          value={divisiId}
          onChange={(e) => setDivisiId(e.target.value)}
          aria-label="Filter Divisi"
          disabled={estateId === "all"}
        >
          {divisiOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.divisi}
            </option>
          ))}
        </select>
        {activeCount > 0 && (
          <button type="button" className="filter-reset" onClick={reset}>
            Reset ({activeCount})
          </button>
        )}
      </div>

      <div className="topbar-right">
        <select
          className="period-pill"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          aria-label="Pemilih periode"
        >
          {periodOptions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button type="button" className="theme-toggle" onClick={toggle} aria-label="Ganti mode terang/gelap">
          {theme === "light" ? <IconMoon /> : <IconSun />}
        </button>
        <div className="avatar" title="Rangga Hartawan">
          {initialsFrom("Rangga Hartawan")}
        </div>
      </div>
    </div>
  );
}
