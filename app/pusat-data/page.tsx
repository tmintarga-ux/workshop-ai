"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { IconUpload } from "@/components/icons";
import type { UploadRow } from "@/lib/data";
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
  const [uploads, setUploads] = useState<UploadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadUploads = useCallback(() => {
    fetch("/api/uploads")
      .then((res) => res.json())
      .then((d) => setUploads(d.uploads ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadUploads();
  }, [loadUploads]);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      setError(null);
      setUploading(true);
      try {
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/uploads", { method: "POST", body: formData });
          if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            throw new Error(body.error ?? `Gagal mengunggah ${file.name}`);
          }
        }
        loadUploads();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengunggah file.");
      } finally {
        setUploading(false);
      }
    },
    [loadUploads]
  );

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
            border: `2px dashed ${dragOver ? "var(--color-accent-600)" : "var(--color-neutral-400)"}`,
            background: dragOver ? "var(--color-accent-100)" : "var(--color-neutral-200)",
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
          }}
        >
          <div className="empty-state-icon">
            <IconUpload size={30} />
          </div>
          <div className="empty-state-title">Tarik &amp; lepas file Excel di sini</div>
          <div className="empty-state-body">
            .xlsx, .xls, .csv — bisa banyak file sekaligus. File disimpan secara privat ke Vercel Blob dan dicatat otomatis di riwayat di bawah.
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files?.length) uploadFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            className="btn btn-primary"
            disabled={uploading}
            style={uploading ? { opacity: 0.6, cursor: "not-allowed" } : undefined}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Mengunggah…" : "Pilih File"}
          </button>
          {error && <div style={{ color: "var(--color-red-text)", fontSize: 13 }}>{error}</div>}
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
                {loading && (
                  <tr>
                    <td className="col-label" colSpan={7}>
                      Memuat riwayat…
                    </td>
                  </tr>
                )}
                {!loading && uploads.length === 0 && (
                  <tr>
                    <td className="col-label" colSpan={7}>
                      Belum ada file yang diunggah.
                    </td>
                  </tr>
                )}
                {uploads.map((u) => (
                  <tr key={u.id ?? u.nama}>
                    <td className="col-label">{u.nama}</td>
                    <td className="col-label">{u.jenis}</td>
                    <td className="col-label">{u.periode}</td>
                    <td>{fmtInt(u.baris)}</td>
                    <td className="col-label">{u.pengunggah}</td>
                    <td className="col-label">{u.tanggal}</td>
                    <td className="col-label">
                      {u.status === "warn" ? (
                        <span className="pill pill-yellow">Perlu diperiksa ⚠</span>
                      ) : u.status === "processing" ? (
                        <span className="pill pill-yellow">Diproses…</span>
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
