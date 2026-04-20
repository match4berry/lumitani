import { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../components/Toast";
import Pagination, { PAGE_SIZE } from "../components/Pagination";
import type { CommissionSettings, CommissionReport } from "../types";

export default function CommissionPage() {
  const [settings, setSettings] = useState<CommissionSettings | null>(null);
  const [report, setReport] = useState<CommissionReport | null>(null);
  const [error, setError] = useState("");
  const [editRate, setEditRate] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);

  const load = async () => {
    try {
      const [s, r] = await Promise.all([
        api.getCommissionSettings(),
        api.getCommissionReport(startDate || undefined, endDate || undefined),
      ]);
      setSettings(s);
      setReport(r);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFilter = () => {
    setPage(1);
    load();
  };

  const handleSaveRate = async () => {
    const rate = parseFloat(editRate);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      showToast("Persentase harus antara 0 dan 100", "error");
      return;
    }
    try {
      const updated = await api.updateCommissionSettings(rate);
      setSettings(updated);
      setShowEditModal(false);
      showToast("Persentase komisi berhasil diperbarui", "success");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Gagal menyimpan", "error");
    }
  };

  const fmt = (v: string | number) =>
    Number(v).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

  const fmtDate = (v: string) =>
    new Date(v).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Laporan Komisi</h1>
          <p className="page-subtitle">
            Kelola persentase komisi dan lihat laporan komisi dari transaksi
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <span>{error}</span>
        </div>
      )}

      {/* Commission settings card */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Persentase Komisi Aktif</span>
            <div className="stat-card-icon" style={{ background: "#dbeafe" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="5" x2="5" y2="19" />
                <circle cx="6.5" cy="6.5" r="2.5" />
                <circle cx="17.5" cy="17.5" r="2.5" />
              </svg>
            </div>
          </div>
          <div className="stat-card-value">
            {settings ? `${Number(settings.rate).toFixed(2)}%` : "—"}
          </div>
          <div className="stat-card-desc">
            <button
              className="btn btn-primary"
              style={{ marginTop: 8, fontSize: 13, padding: "6px 16px" }}
              onClick={() => {
                setEditRate(settings ? String(settings.rate) : "5");
                setShowEditModal(true);
              }}
            >
              Ubah Persentase
            </button>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Komisi</span>
            <div className="stat-card-icon" style={{ background: "#dcfce7" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <div className="stat-card-value" style={{ color: "#16a34a" }}>
            {report ? fmt(report.summary.total_commission) : "—"}
          </div>
          <div className="stat-card-desc">
            Dari {report?.summary.total_orders ?? 0} pesanan selesai
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Pendapatan</span>
            <div className="stat-card-icon" style={{ background: "#fef3c7" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
          </div>
          <div className="stat-card-value" style={{ color: "#f59e0b" }}>
            {report ? fmt(report.summary.total_revenue) : "—"}
          </div>
          <div className="stat-card-desc">
            Total harga pesanan berstatus Selesai
          </div>
        </div>
      </div>

      {/* Date filter */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#334155" }}>Filter Tanggal:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-input"
              style={{ width: "auto" }}
            />
            <span style={{ color: "#94a3b8" }}>—</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-input"
              style={{ width: "auto" }}
            />
            <button className="btn btn-primary" onClick={handleFilter}>
              Terapkan
            </button>
            {(startDate || endDate) && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setTimeout(load, 0);
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Commission orders table */}
      <div className="card">
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 13, color: "var(--text-secondary)", paddingBottom: 4 }}>
            Menampilkan {report?.orders.length ?? 0} pesanan selesai dengan komisi
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID Pesanan</th>
              <th>Nama Pelanggan</th>
              <th>Tanggal</th>
              <th style={{ textAlign: "right" }}>Total Harga</th>
              <th style={{ textAlign: "right" }}>Rate (%)</th>
              <th style={{ textAlign: "right" }}>Komisi</th>
            </tr>
          </thead>
          <tbody>
            {report?.orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((o) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 500 }}>{o.order_code}</td>
                <td>{o.customer_name}</td>
                <td>{fmtDate(o.order_date)}</td>
                <td style={{ textAlign: "right" }}>{fmt(o.total_price)}</td>
                <td style={{ textAlign: "right" }}>{Number(o.commission_rate).toFixed(2)}%</td>
                <td style={{ textAlign: "right", fontWeight: 600, color: "#16a34a" }}>
                  {fmt(o.commission_amount)}
                </td>
              </tr>
            ))}
            {(!report || report.orders.length === 0) && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>
                  Tidak ada data komisi ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination currentPage={page} totalItems={report?.orders.length ?? 0} onPageChange={setPage} label="pesanan" />
      </div>

      {/* Edit rate modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ubah Persentase Komisi</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                ✕
              </button>
            </div>
            <p style={{ marginBottom: 16, fontSize: 14, color: "#64748b" }}>
              Perubahan hanya berlaku untuk transaksi baru. Transaksi lama tidak terpengaruh.
            </p>
            <div className="form-group">
              <label className="form-label">Persentase Komisi (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={editRate}
                onChange={(e) => setEditRate(e.target.value)}
                className="form-input"
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button className="btn btn-primary" onClick={handleSaveRate}>
                Simpan
              </button>
              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
