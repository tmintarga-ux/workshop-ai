"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({
  title,
  sidebarFooter = "periode",
  children,
}: {
  title: string;
  sidebarFooter?: "periode" | "histori" | "none";
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="shell">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        mobileOpen={mobileOpen}
        footer={sidebarFooter}
      />
      <div className={`sidebar-scrim${mobileOpen ? " is-open" : ""}`} onClick={() => setMobileOpen(false)} />
      <div className="main">
        <Topbar title={title} onOpenMobile={() => setMobileOpen(true)} />
        <div className="page-body">{children}</div>
      </div>
    </div>
  );
}
