"use client";

import { AppShell } from "@/components/AppShell";
import { IconUpload } from "@/components/icons";
import { uploads } from "@/lib/data";
import { fmtInt } from "@/lib/format";

const JENIS_DATA = [
  "Produksi Estate–Divisi",
  "Analisa Produksi Mingguan",
  "Data Karyawan Panen",
  "Absensi Pemanen",
  "Sensus Buah",
  "Master Areal (Luas TM & TT)",
  "Standar Yield",
  "Curah Hujan",
];

export default function PusatDataPage() {
  return (
    <AppShell title="Pusat Data">
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          className="card"
          style={{
            alignItems: "center",
            textAlign: "center",
            gap: 12,
            padding: "40px 24px",
            border: "2px dashed var(--color-neutral-400)",
            background: "var(--color-neutral-200)",
          }}
        >
          <div className="empty-state-icon">
            <IconUpload size={30} />
          </div>
          <div className="empty-state-title">Tarik &amp; lepas file Excel di sini</div>
          <div className="empty-state-body">
            .xlsx, .xls, .csv — bisa banyak file sekaligus. Pemetaan kolom otomatis dan validasi baris segera hadir di modul ini.
          </div>
          <button type="button" className="btn btn-primary" disabled style={{ opacity: 0.6, cursor: "not-allowed" }}>
            Pilih File
          </button>
        </div>

        <div className="card">
          <span className="card-heading">Jenis data yang didukung</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {JENIS_DATA.map((j) => (
              <span key={j} className="tag tag-neutral" style={{ background: "var(--color-neutral-200)", borderRadius: 999, padding: "5px 12px", fontSize: 12.5 }}>
                {j}
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <span className="card-heading">Riwayat file</span>
          <div className="table-scroll">
            <table className="data-table data-table-wide">
              <thead>
                <tr>
                  <th className="col-label">Nama file</th>
                  <th className="col-label">Jenis data</th>
                  <th className="col-label">Periode</th>
                  <th>Baris</th>
                  <th className="col-label">Pengunggah</th>
                  <th className="col-label">Tanggal</th>
                  <th className="col-label">Status</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((u) => (
                  <tr key={u.nama}>
                    <td className="col-label">{u.nama}</td>
                    <td className="col-label">{u.jenis}</td>
                    <td className="col-label">{u.periode}</td>
                    <td>{fmtInt(u.baris)}</td>
                    <td className="col-label">{u.pengunggah}</td>
                    <td className="col-label">{u.tanggal}</td>
                    <td className="col-label">
                      {u.status === "warn" ? (
                        <span className="pill pill-yellow">Perlu diperiksa ⚠</span>
                      ) : (
                        <span className="pill pill-green">Diproses ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
