"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconDashboard,
  IconForecasting,
  IconBudgeting,
  IconTurnOver,
  IconKecukupan,
  IconHke,
  IconPusatData,
  IconChevronLeft,
} from "./icons";
import { periode } from "@/lib/data";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: IconDashboard },
  { href: "/forecasting", label: "Forecasting Produksi", icon: IconForecasting },
  { href: "/budgeting-produksi", label: "Budgeting Produksi", icon: IconBudgeting },
  { href: "/turn-over-pemanen", label: "Turn Over Pemanen", icon: IconTurnOver },
  { href: "/kecukupan-tenaga-panen", label: "Kecukupan Tenaga Panen", icon: IconKecukupan },
  { href: "/hari-kerja-efektif", label: "Hari Kerja Efektif", icon: IconHke },
  { href: "/pusat-data", label: "Pusat Data", icon: IconPusatData },
];

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  footer = "periode",
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  footer?: "periode" | "histori" | "none";
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`sidebar${collapsed ? " is-collapsed" : ""}${mobileOpen ? " is-mobile-open" : ""}`}
    >
      <div className="sidebar-brand">
        <div className="sidebar-logo">S</div>
        <div className="sidebar-title">Sawit Insight</div>
      </div>

      <nav className="sidebar-nav" aria-label="Navigasi utama">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link${active ? " is-active" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon />
              <span className="sidebar-link-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {footer !== "none" && (
        <div className="sidebar-footer">
          {footer === "periode" ? (
            <>
              <div className="sidebar-footer-label">Periode data</div>
              <div className="sidebar-footer-value">{periode.aktif}</div>
              <div className="sidebar-footer-meta">
                terbit {periode.terbit} · {periode.fileCount} file
              </div>
            </>
          ) : (
            <>
              <div className="sidebar-footer-label">Histori tersedia</div>
              <div className="sidebar-footer-value">{periode.historiBulan} bulan</div>
              <div className="sidebar-footer-meta">cukup untuk musiman (min. 24)</div>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        className="sidebar-collapse-btn"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar jadi ikon"}
        style={{ transform: collapsed ? "rotate(180deg)" : undefined }}
      >
        <IconChevronLeft />
      </button>
    </aside>
  );
}
