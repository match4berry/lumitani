import { useEffect, useState } from "react";
import api from "../api";
import type { Product, Farmer, Commodity, CommodityPrice } from "../types";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [prices, setPrices] = useState<CommodityPrice[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterMode, setFilterMode] = useState<"monthly" | "yearly" | "all">("monthly");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    Promise.all([
      api.getProducts(),
      api.getFarmers(),
      api.getCommodities(),
      api.getPrices(),
      api.getOrders(),
    ])
      .then(([p, f, c, pr, o]) => {
        setProducts(p);
        setFarmers(f);
        setCommodities(c);
        setPrices(pr);
        setOrders(o);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Memuat data...</div>;

  // ✅ FIX boolean backend
  const isActive = (v: any) => v === true || v === 1 || v === "true";

  const activeProducts = products.filter((p) => isActive(p.is_active));
  const activePrices = prices.filter((p) => isActive(p.is_active));
  const activeFarmers = farmers.filter((f) => isActive(f.is_active));

  const productsWithoutPrice = products.filter(
    (p) => !p.current_price && isActive(p.is_active)
  );

  const commodityDist = commodities.map((c) => ({
    name: c.name,
    count: products.filter((p) => p.commodity_id === c.id).length,
  }));

  const maxCount = Math.max(...commodityDist.map((d) => d.count), 1);

  const barColors = ["#16a34a", "#dc2626", "#f59e0b", "#3b82f6", "#8b5cf6", "#ec4899"];

  const fmt = (v: any) =>
    v
      ? Number(v).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      })
      : "—";

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // ================= ORDER =================
  const completedOrders = orders.filter((o) => o.status === "Selesai");

  const filterFn = (o: any) => {
    const d = new Date(o.created_at);

    if (filterMode === "all") return true;
    if (filterMode === "yearly") return d.getFullYear() === selectedYear;

    return (
      d.getMonth() + 1 === selectedMonth &&
      d.getFullYear() === selectedYear
    );
  };

  const filteredOrders = completedOrders.filter(filterFn);

  const filteredSales = filteredOrders.reduce(
    (sum, o) => sum + Number(o.total_price || 0),
    0
  );

  // growth
  const prevOrders = completedOrders.filter((o) => {
    const d = new Date(o.created_at);
    return d.getMonth() + 1 === selectedMonth - 1;
  });

  const prevSales = prevOrders.reduce(
    (sum, o) => sum + Number(o.total_price || 0),
    0
  );

  const growth =
    prevSales === 0 ? 0 : ((filteredSales - prevSales) / prevSales) * 100;

  const getMonthName = (month: number) => {
    return new Date(2000, month - 1, 1).toLocaleString("id-ID", {
      month: "short",
    });
  };

  const getPeriodLabel = () => {
    if (filterMode === "all") return "Semua Waktu";
    if (filterMode === "yearly") return `Tahun ${selectedYear}`;
    return `Bulan ${getMonthName(selectedMonth)} ${selectedYear}`;
  };

  // ================= GRAFIK PENJUALAN =================
  const salesChartData = () => {
    const map: Record<string, number> = {};

    completedOrders.forEach((o) => {
      const d = new Date(o.created_at);

      if (filterMode === "monthly") {
        if (d.getFullYear() !== selectedYear) return;

        const key = getMonthName(d.getMonth() + 1);
        map[key] = (map[key] || 0) + Number(o.total_price || 0);
      }

      else if (filterMode === "yearly") {
        if (d.getFullYear() !== selectedYear) return;

        const key = getMonthName(d.getMonth() + 1);
        map[key] = (map[key] || 0) + Number(o.total_price || 0);
      }

      else {
        const key = d.getFullYear().toString();
        map[key] = (map[key] || 0) + Number(o.total_price || 0);
      }
    });

    return Object.entries(map).map(([label, value]) => ({
      label,
      value,
    }));
  };

  const chartData = salesChartData();
  const maxSales = Math.max(...chartData.map((d) => d.value), 1);

  // ================= EXPORT =================

  // EXPORT EXCEL
  const exportToExcel = () => {
    const data = filteredOrders.map((o) => ({
      Tanggal: new Date(o.created_at).toLocaleDateString("id-ID"),
      Pembeli: o.customer_name || "-",
      Total: Number(o.total_price || 0),
      Status: o.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");

    XLSX.writeFile(
      workbook,
      `laporan-penjualan-${getPeriodLabel()}.xlsx`
    );
  };

  // EXPORT PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text(`Laporan Penjualan (${getPeriodLabel()})`, 14, 15);

    const tableData = filteredOrders.map((o) => [
      new Date(o.created_at).toLocaleDateString("id-ID"),
      o.customer_name || "-",
      fmt(o.total_price),
      o.status,
    ]);

    autoTable(doc, {
      startY: 20,
      head: [["Tanggal", "Pembeli", "Total", "Status"]],
      body: tableData,
    });

    doc.save(`laporan-penjualan-${getPeriodLabel()}.pdf`);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">
          Ringkasan statistik platform e-commerce pertanian
        </p>
      </div>

      {/* FILTER */}
      <div className="filter-bar" style={{ marginBottom: 20 }}>
        <select value={filterMode} onChange={(e) => setFilterMode(e.target.value as any)}>
          <option value="monthly">Bulanan</option>
          <option value="yearly">Tahunan</option>
          <option value="all">Semua</option>
        </select>

        {filterMode === "monthly" && (
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date(2000, i, 1);
              const monthName = date.toLocaleString("id-ID", { month: "short" });

              return (
                <option key={i} value={i + 1}>
                  {monthName}
                </option>
              );
            })}
          </select>
        )}

        {filterMode !== "all" && (
          <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {[2023, 2024, 2025, 2026].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        )}
      </div>

      {/* ALERT */}
      {productsWithoutPrice.length > 0 && (
        <div className="alert alert-warning">
          ⚠️ Ada {productsWithoutPrice.length} produk tanpa harga aktif
        </div>
      )}

      {/* STATS */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-card-title">Produk Aktif</div>
          <div className="stat-card-value">{activeProducts.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-title">Harga Kolektif Aktif</div>
          <div className="stat-card-value">{activePrices.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-title">Petani</div>
          <div className="stat-card-value">{activeFarmers.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-title">Total Penjualan</div>
          <div className="stat-card-value">{fmt(filteredSales)}</div>
          <div className="stat-card-desc">{getPeriodLabel()}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-title">Transaksi</div>
          <div className="stat-card-value">{filteredOrders.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-title">Pertumbuhan</div>
          <div className="stat-card-value" style={{ color: growth >= 0 ? "green" : "red" }}>
            {growth.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* LAPORAN TRANSAKSI */}
      <div className="card">
        <div className="card-body">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Laporan Transaksi ({getPeriodLabel()})</h3>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={exportToExcel}>Export Excel</button>
              <button onClick={exportToPDF}>Export PDF</button>
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Pembeli</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td>{new Date(o.created_at).toLocaleDateString("id-ID")}</td>
                  <td>{o.customer_name || "-"}</td>
                  <td>{fmt(o.total_price)}</td>
                  <td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* GRAFIK PENJUALAN */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-body">
          <h3>Grafik Penjualan ({getPeriodLabel()})</h3>

          <div className="chart-bar">
            {chartData.map((d, i) => (
              <div key={i} className="chart-bar-item">
                <div style={{ fontSize: 12 }}>{fmt(d.value)}</div>

                <div
                  className="chart-bar-fill"
                  style={{
                    height: `${Math.max((d.value / maxSales) * 140, 4)}px`,
                    background: "#16a34a",
                  }}
                />

                <div>{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GRAFIK + PRODUK */}
      <div className="dashboard-grid" style={{ marginTop: 24 }}>

        <div className="card">
          <div className="card-body">
            <h3>Distribusi Produk per Komoditas</h3>
            <div className="chart-bar">
              {commodityDist.map((d, i) => (
                <div key={d.name} className="chart-bar-item">
                  <div>{d.count}</div>
                  <div
                    className="chart-bar-fill"
                    style={{
                      height: `${Math.max((d.count / maxCount) * 140, 4)}px`,
                      background: barColors[i % barColors.length],
                    }}
                  />
                  <div>{d.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Produk Terbaru</h3>
            {recentProducts.map((p) => (
              <div key={p.id}>
                {p.name} - {p.farmer_name}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* HARGA KOLEKTIF */}
      <div className="card">
        <div className="card-body">
          <h3>Harga Kolektif Aktif</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Komoditas</th>
                <th>Grade</th>
                <th>Harga</th>
                <th>Periode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {activePrices.map((p) => (
                <tr key={p.id}>
                  <td>{p.commodity_name}</td>
                  <td>{p.grade_name}</td>
                  <td>{fmt(p.price)}</td>
                  <td>
                    {new Date(p.start_date).toLocaleDateString("id-ID")} -{" "}
                    {new Date(p.end_date).toLocaleDateString("id-ID")}
                  </td>
                  <td>Aktif</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}