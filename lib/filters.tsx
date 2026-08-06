"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Hierarki } from "./data";

const PERIODS = ["Juli 2026 · vs 2025", "Juni 2026 · vs 2025", "Kuartal 3 2026", "Tahun 2026 (YTD)"];

type EstateOption = { id: string; nama: string };
type DivisiOption = { id: string; divisi: string; estate: string };

type FiltersMeta = {
  hierarki: Hierarki;
  estates: EstateOption[];
  divisions: DivisiOption[];
};

type FilterState = {
  estateId: string; // "all" | estate id
  divisiId: string; // "all" | divisi id
  period: string;
  setEstateId: (id: string) => void;
  setDivisiId: (id: string) => void;
  setPeriod: (p: string) => void;
  reset: () => void;
  activeCount: number;
  meta: FiltersMeta | null;
};

const FilterContext = createContext<FilterState | null>(null);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [estateId, setEstateIdRaw] = useState("all");
  const [divisiId, setDivisiId] = useState("all");
  const [period, setPeriod] = useState(PERIODS[0]);
  const [meta, setMeta] = useState<FiltersMeta | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/filters-meta")
      .then((res) => res.json())
      .then((d: FiltersMeta) => {
        if (!cancelled) setMeta(d);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setEstateId = (id: string) => {
    setEstateIdRaw(id);
    setDivisiId("all");
  };

  const reset = () => {
    setEstateIdRaw("all");
    setDivisiId("all");
    setPeriod(PERIODS[0]);
  };

  const activeCount = (estateId !== "all" ? 1 : 0) + (divisiId !== "all" ? 1 : 0);

  const value = useMemo(
    () => ({ estateId, divisiId, period, setEstateId, setDivisiId, setPeriod, reset, activeCount, meta }),
    [estateId, divisiId, period, activeCount, meta]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within FilterProvider");
  return ctx;
}

export function usePeriodOptions() {
  return PERIODS;
}

export function useHierarki(): Hierarki {
  const { meta } = useFilters();
  return meta?.hierarki ?? { mdo: "…", region: "…" };
}

export function useEstateOptions() {
  const { meta } = useFilters();
  const estates = meta?.estates ?? [];
  return [{ id: "all", nama: "Semua Estate" }, ...estates.map((e) => ({ id: e.id, nama: e.nama }))];
}

export function useDivisiOptions(estateId: string) {
  const { meta } = useFilters();
  if (estateId === "all") return [{ id: "all", divisi: "Semua Divisi" }];
  const estates = meta?.estates ?? [];
  const divisions = meta?.divisions ?? [];
  const estate = estates.find((e) => e.id === estateId);
  const rows = divisions.filter((d) => d.estate === estate?.nama);
  return [{ id: "all", divisi: "Semua Divisi" }, ...rows.map((d) => ({ id: d.id, divisi: d.divisi }))];
}
