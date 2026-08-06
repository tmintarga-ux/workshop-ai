import { AppShell } from "./AppShell";
import { IconUpload } from "./icons";

export function PlaceholderPage({
  title,
  tagline,
  bullets,
}: {
  title: string;
  tagline: string;
  bullets: string[];
}) {
  return (
    <AppShell title={title}>
      <div className="card empty-state" style={{ flex: 1 }}>
        <div className="empty-state-icon">
          <IconUpload size={30} />
        </div>
        <div className="empty-state-title">{title} — segera hadir</div>
        <div className="empty-state-body">{tagline}</div>
        <ul style={{ textAlign: "left", fontSize: 13.5, color: "var(--color-neutral-700)", lineHeight: 1.7, maxWidth: 480 }}>
          {bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div style={{ fontSize: 12.5, color: "var(--color-neutral-600)" }}>
          Modul ini dirancang di PRD tetapi belum masuk mockup hi-fi — lihat Dashboard, Forecasting Produksi, dan Kecukupan Tenaga Panen untuk pola tampilan yang sudah dibangun.
        </div>
      </div>
    </AppShell>
  );
}
