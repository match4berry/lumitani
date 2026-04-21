import { useEffect, useState } from "react";
import api from "../api";
import Pagination, { PAGE_SIZE } from "../components/Pagination";
import type { SalesReport, SalesReportFarmer } from "../types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SalesReportPage() {
  const [report, setReport] = useState<SalesReport | null>(null);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expandedFarmer, setExpandedFarmer] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const load = async () => {
    try {
      const r = await api.getSalesReport(startDate || undefined, endDate || undefined);
      setReport(r);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  };

  useEffect(() => { load(); }, []);

  const handleFilter = () => { setPage(1); load(); };

  const fmt = (v: string | number | null | undefined) =>
    v ? Number(v).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }) : "Rp 0";

  const fmtAxis = (v: number) => {
    if (v >= 1_000_000) return `Rp ${(v / 1_000_000).toFixed(0)}M`;
    if (v >= 1_000) return `Rp ${(v / 1_000).toFixed(0)}k`;
    return `Rp ${v}`;
  };

  const chartData = (report?.farmers || []).slice(0, 10).map((f) => ({
    name: f.farmer_name,
    total: Number(f.total_sales),
  }));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Laporan Penjualan</h1>
          <p className="page-subtitle">Analisis performa penjualan per petani</p>
        </div>
      </div>

      {error && <div className="alert alert-danger"><span>{error}</span></div>}

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: "#64748b" }}>Total Penjualan (Net)</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#16a34a" }}>{fmt(report?.summary.total_revenue)}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
            Setelah dipotong komisi{report?.summary.gross_revenue ? ` (omset: ${fmt(report.summary.gross_revenue)})` : ""}
          </div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: "#64748b" }}>Total Transaksi Selesai</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#16a34a" }}>{report?.summary.total_transactions ?? 0}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Pesanan dengan status selesai</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 14, color: "#64748b" }}>Total Petani Aktif</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#16a34a" }}>{report?.summary.total_farmers ?? 0}</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Petani yang berkontribusi</div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <label className="form-label">Tanggal Mulai</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-input" />
          </div>
          <div>
            <label className="form-label">Tanggal Akhir</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-input" />
          </div>
          <button className="btn btn-primary" onClick={handleFilter}>Terapkan</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
          <span className="badge badge-success" style={{ fontSize: 11 }}>Completed Orders Only</span>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>ⓘ Data hanya dihitung dari pesanan berstatus selesai</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>Top 10 Petani Berdasarkan Penjualan</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 60, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" angle={-35} textAnchor="end" tick={{ fontSize: 12 }} interval={0} />
              <YAxis tickFormatter={fmtAxis} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [fmt(value), "Penjualan"]} />
              <Bar dataKey="total" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Belum ada data penjualan</div>
        )}
      </div>

      {/* Detail Table */}
      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>Rincian Penjualan per Petani</h3>
        {report?.farmers && report.farmers.length > 0 ? (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Nama Petani</th>
                <th>Total Penjualan</th>
                <th>Total Transaksi</th>
                <th>Rata-rata Nilai Order</th>
              </tr>
            </thead>
            <tbody>
              {report.farmers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((f) => (
                <FarmerRow key={f.farmer_id} farmer={f} expanded={expandedFarmer === f.farmer_id} onToggle={() => setExpandedFarmer(expandedFarmer === f.farmer_id ? null : f.farmer_id)} fmt={fmt} />
              ))}
            </tbody>
          </table>
          <Pagination currentPage={page} totalItems={report.farmers.length} onPageChange={setPage} label="petani" />
        </>
        ) : (
          <div style={{ textAlign: "center", padding: 40, color: "#94a3b8" }}>Belum ada data penjualan</div>
        )}
      </div>
    </div>
  );
}

function FarmerRow({ farmer, expanded, onToggle, fmt }: { farmer: SalesReportFarmer; expanded: boolean; onToggle: () => void; fmt: (v: string | number | null | undefined) => string }) {
  return (
    <>
      <tr style={{ cursor: "pointer" }} onClick={onToggle}>
        <td>
          <span style={{ display: "inline-block", transition: "transform 0.2s", transform: expanded ? "rotate(90deg)" : "rotate(0deg)", fontSize: 14 }}>▶</span>
        </td>
        <td style={{ fontWeight: 500 }}>{farmer.farmer_name}</td>
        <td style={{ color: "#16a34a", fontWeight: 600 }}>{fmt(farmer.total_sales)}</td>
        <td style={{ textAlign: "center" }}>{farmer.total_transactions}</td>
        <td style={{ textAlign: "right" }}>{fmt(farmer.avg_order_value)}</td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} style={{ background: "#f8fafc", padding: "12px 24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>Total Penjualan</div>
                <div style={{ fontWeight: 600, color: "#16a34a" }}>{fmt(farmer.total_sales)}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>Jumlah Transaksi</div>
                <div style={{ fontWeight: 600 }}>{farmer.total_transactions}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>Rata-rata per Order</div>
                <div style={{ fontWeight: 600 }}>{fmt(farmer.avg_order_value)}</div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
