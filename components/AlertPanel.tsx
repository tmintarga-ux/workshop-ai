import Link from "next/link";
import type { Alert } from "@/lib/data";
import { Badge } from "./Kpi";

export function AlertPanel({ alerts, note }: { alerts: Alert[]; note?: string }) {
  return (
    <div className="alert-panel">
      <div className="alert-panel-head">
        <span className="alert-dot" />
        <span className="card-heading">Perlu perhatian</span>
        <span className="alert-count-note">{alerts.length} peringatan otomatis{note ? ` · ${note}` : ""}</span>
      </div>
      <div className="alert-grid">
        {alerts.map((a, i) => (
          <div key={i} className={`alert-row tone-${a.level}`}>
            <Badge level={a.level} />
            <span className="alert-row-text">{a.text}</span>
            <Link href={a.href} className="alert-row-link">
              Buka →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
