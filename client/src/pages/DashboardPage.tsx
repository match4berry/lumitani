import { useEffect, useState } from "react";
import api from "../api";
import type { Product, Farmer, Commodity, CommodityPrice } from "../types";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [prices, setPrices] = useState<CommodityPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getProducts(),
      api.getFarmers(),
      api.getCommodities(),
      api.getPrices(),
    ])
      .then(([p, f, c, pr]) => {
        setProducts(p);
        setFarmers(f);
        setCommodities(c);
        setPrices(pr);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
        Memuat data...
      </div>
    );

  const activeProducts = products.filter((p) => p.is_active);
  const activePrices = prices.filter((p) => p.is_active);
  const activeFarmers = farmers.filter((f) => f.is_active);
  const productsWithoutPrice = products.filter(
    (p) => !p.current_price && p.is_active
  );

  const commodityDist = commodities.map((c) => ({
    name: c.name,
    count: products.filter((p) => p.commodity_id === c.id).length,
  }));
  const maxCount = Math.max(...commodityDist.map((d) => d.count), 1);
  const barColors = [
    "#16a34a",
    "#dc2626",
    "#f59e0b",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ];

  const fmt = (v: string | null | undefined) =>
    v
      ? Number(v).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        })
      : "—";

  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">
            Ringkasan statistik platform e-commerce pertanian
          </p>
        </div>
      </div>

      {productsWithoutPrice.length > 0 && (
        <div className="alert alert-warning">
          <span>⚠️</span>
          <span>
            <strong>Perhatian!</strong> Ada {productsWithoutPrice.length} produk
            yang tidak bisa dipublikasi karena tidak ada harga kolektif aktif.
          </span>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Produk Aktif</span>
            <div
              className="stat-card-icon"
              style={{ background: "#dcfce7" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
              >
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{activeProducts.length}</div>
          <div className="stat-card-desc">
            Dari total {products.length} produk
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Harga Kolektif Aktif</span>
            <div
              className="stat-card-icon"
              style={{ background: "#dbeafe" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              >
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{activePrices.length}</div>
          <div className="stat-card-desc">Periode aktif saat ini</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Petani</span>
            <div
              className="stat-card-icon"
              style={{ background: "#fef3c7" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
          </div>
          <div className="stat-card-value">{activeFarmers.length}</div>
          <div className="stat-card-desc">Petani terdaftar</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Pertumbuhan</span>
            <div
              className="stat-card-icon"
              style={{ background: "#fce7f3" }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ec4899"
                strokeWidth="2"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            </div>
          </div>
          <div className="stat-card-value" style={{ color: "#16a34a" }}>
            +
            {products.length > 0
              ? Math.round((activeProducts.length / products.length) * 100)
              : 0}
            %
          </div>
          <div className="stat-card-desc">Produk aktif</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
              Distribusi Produk per Komoditas
            </h3>
            <div className="chart-bar">
              {commodityDist.map((d, i) => (
                <div key={d.name} className="chart-bar-item">
                  <div className="chart-bar-value">{d.count}</div>
                  <div
                    className="chart-bar-fill"
                    style={{
                      height: `${Math.max((d.count / maxCount) * 140, 4)}px`,
                      background: barColors[i % barColors.length],
                    }}
                  />
                  <div className="chart-bar-label">{d.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
              Produk Terbaru
            </h3>
            <div className="product-card-list">
              {recentProducts.map((p) => (
                <div key={p.id} className="product-card-item">
                  {p.photo_url ? (
                    <img
                      src={p.photo_url}
                      alt={p.name}
                      className="product-card-img"
                    />
                  ) : (
                    <div className="product-card-img-placeholder">📦</div>
                  )}
                  <div className="product-card-info">
                    <div className="product-card-name">{p.name}</div>
                    <div className="product-card-meta">
                      {p.farmer_name} • Grade {p.grade_name}
                    </div>
                  </div>
                  <span
                    className={`badge ${p.is_active ? "badge-success" : "badge-muted"}`}
                  >
                    {p.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              ))}
              {recentProducts.length === 0 && (
                <p
                  style={{
                    color: "#94a3b8",
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  Belum ada produk
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
            Harga Kolektif Aktif
          </h3>
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
                  <td style={{ fontWeight: 600 }}>{p.commodity_name}</td>
                  <td>
                    <span className="badge badge-info">
                      Grade {p.grade_name}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {fmt(p.price)}{" "}
                    <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                      per kg
                    </span>
                  </td>
                  <td style={{ color: "#64748b" }}>
                    {new Date(p.start_date).toLocaleDateString("id-ID")} -{" "}
                    {new Date(p.end_date).toLocaleDateString("id-ID")}
                  </td>
                  <td>
                    <span className="badge badge-success">Aktif</span>
                  </td>
                </tr>
              ))}
              {activePrices.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      color: "#94a3b8",
                      padding: 24,
                    }}
                  >
                    Belum ada harga aktif
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
