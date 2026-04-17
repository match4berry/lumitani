import { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../components/Toast";
import type { Order, OrderItem, OrderStatus, OrderStatusSummary } from "../types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  menunggu_proses: "Menunggu Proses",
  diproses: "Diproses",
  dikirim: "Dikirim",
  selesai: "Selesai",
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  menunggu_proses: "badge-muted",
  diproses: "badge-warning",
  dikirim: "badge-danger",
  selesai: "badge-success",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  menunggu_proses: "#1e293b",
  diproses: "#3b82f6",
  dikirim: "#dc2626",
  selesai: "#16a34a",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<OrderStatusSummary>({
    menunggu_proses: 0,
    diproses: 0,
    dikirim: 0,
    selesai: 0,
  });
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "">("");
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [detailItems, setDetailItems] = useState<OrderItem[]>([]);
  const [statusModalOrder, setStatusModalOrder] = useState<Order | null>(null);

  const openDetail = async (order: Order) => {
    try {
      const full = await api.getOrder(order.id);
      setDetailOrder(full);
      setDetailItems(full.items || []);
    } catch {
      setDetailOrder(order);
      setDetailItems([]);
    }
  };

  const load = async () => {
    try {
      const [o, s] = await Promise.all([
        api.getOrders(),
        api.getOrderSummary(),
      ]);
      setOrders(o);
      setSummary(s);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  };

  useEffect(() => {
    load();
  }, []);

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

  const filtered = orders.filter((o) => {
    if (
      search &&
      !o.order_code.toLowerCase().includes(search.toLowerCase()) &&
      !o.customer_name.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (filterStatus !== "" && o.status !== filterStatus) return false;
    return true;
  });

  const handleStatusChange = async (order: Order, newStatus: OrderStatus) => {
    if (!confirm("Ubah status pesanan?")) return;
    try {
      await api.updateOrderStatus(order.id, newStatus);
      setStatusModalOrder(null);
      load();
      showToast("Status pesanan diperbarui", "success");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manajemen Pesanan</h1>
          <p className="page-subtitle">
            Kelola dan pantau semua pesanan pelanggan
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <span>{error}</span>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ padding: "16px 20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div style={{ flex: 1, position: "relative" }}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                placeholder="Cari berdasarkan nomor pesanan atau nama pelanggan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ width: "100%", paddingLeft: 40 }}
              />
            </div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ cursor: "pointer", flexShrink: 0 }}
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as OrderStatus | "")
              }
              className="form-select"
              style={{ minWidth: 160 }}
            >
              <option value="">Semua Status</option>
              <option value="menunggu_proses">Menunggu Proses</option>
              <option value="diproses">Diproses</option>
              <option value="dikirim">Dikirim</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>

          <div
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              paddingBottom: 4,
            }}
          >
            Menampilkan {filtered.length} dari {orders.length} pesanan
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID Pesanan</th>
              <th>Nama Pelanggan</th>
              <th>Tanggal Pesanan</th>
              <th>Total Harga</th>
              <th>Komisi (%)</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id}>
                <td style={{ fontWeight: 500 }}>{o.order_code}</td>
                <td>{o.customer_name}</td>
                <td>{fmtDate(o.order_date)}</td>
                <td>{fmt(o.total_price)}</td>
                <td style={{ textAlign: "right" }}>
                  {o.commission_rate != null ? `${Number(o.commission_rate).toFixed(2)}%` : "—"}
                </td>
                <td>
                  <span
                    className={`badge ${STATUS_BADGE[o.status]}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setStatusModalOrder(o)}
                  >
                    {STATUS_LABELS[o.status]}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-ghost"
                    style={{
                      color: "#3b82f6",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                    onClick={() => openDetail(o)}
                  >
                    Lihat Detail
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: 24,
                    color: "#94a3b8",
                  }}
                >
                  Tidak ada pesanan ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Status summary cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {(
          ["menunggu_proses", "diproses", "dikirim", "selesai"] as OrderStatus[]
        ).map((status) => (
          <div className="stat-card" key={status}>
            <div className="stat-card-title" style={{ textTransform: "none", letterSpacing: 0 }}>
              {STATUS_LABELS[status]}
            </div>
            <div
              className="stat-card-value"
              style={{ color: STATUS_COLOR[status], marginTop: 12 }}
            >
              {summary[status]}
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {detailOrder && (
        <div className="modal-overlay" onClick={() => setDetailOrder(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detail Pesanan</h3>
              <button
                className="modal-close"
                onClick={() => setDetailOrder(null)}
              >
                ✕
              </button>
            </div>
            <table className="data-table">
              <tbody>
                {(
                  [
                    ["ID Pesanan", detailOrder.order_code],
                    ["Nama Pelanggan", detailOrder.customer_name],
                    ["Tanggal Pesanan", fmtDate(detailOrder.order_date)],
                    ["Total Harga", fmt(detailOrder.total_price)],
                    [
                      "Tarif Komisi",
                      detailOrder.commission_rate != null
                        ? `${Number(detailOrder.commission_rate).toFixed(2)}%`
                        : "—",
                    ],
                    [
                      "Jumlah Komisi",
                      detailOrder.commission_amount != null
                        ? fmt(detailOrder.commission_amount)
                        : "—",
                    ],
                    ["Status", STATUS_LABELS[detailOrder.status]],
                    [
                      "Dibuat",
                      new Date(detailOrder.created_at).toLocaleString("id-ID"),
                    ],
                    [
                      "Diperbarui",
                      new Date(detailOrder.updated_at).toLocaleString("id-ID"),
                    ],
                  ] as [string, string][]
                ).map(([label, val]) => (
                  <tr key={label}>
                    <td
                      style={{
                        fontWeight: 600,
                        color: "#64748b",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </td>
                    <td>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {detailItems.length > 0 && (
              <>
                <h4 style={{ margin: "20px 0 10px", color: "#334155" }}>Item Pesanan</h4>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produk</th>
                      <th style={{ textAlign: "right" }}>Jumlah</th>
                      <th style={{ textAlign: "right" }}>Harga Satuan</th>
                      <th style={{ textAlign: "right" }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product_name}</td>
                        <td style={{ textAlign: "right" }}>{item.quantity}</td>
                        <td style={{ textAlign: "right" }}>{fmt(item.unit_price)}</td>
                        <td style={{ textAlign: "right" }}>{fmt(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button
                className="btn btn-secondary"
                onClick={() => setDetailOrder(null)}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status change modal */}
      {statusModalOrder && (
        <div
          className="modal-overlay"
          onClick={() => setStatusModalOrder(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ubah Status Pesanan</h3>
              <button
                className="modal-close"
                onClick={() => setStatusModalOrder(null)}
              >
                ✕
              </button>
            </div>
            <p style={{ marginBottom: 16, fontSize: 14, color: "#64748b" }}>
              Pesanan <strong>{statusModalOrder.order_code}</strong> —{" "}
              {statusModalOrder.customer_name}
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {(() => {
                const flow: OrderStatus[] = ["menunggu_proses", "diproses", "dikirim", "selesai"];
                const currentIndex = flow.indexOf(statusModalOrder.status);
                const nextStatus = flow[currentIndex + 1];
                return flow.map((status) => {
                  const isCurrent = statusModalOrder.status === status;
                  const isNext = status === nextStatus;
                  return (
                    <button
                      key={status}
                      className={`btn ${isCurrent ? "btn-primary" : isNext ? "btn-success" : "btn-secondary"}`}
                      onClick={() =>
                        handleStatusChange(statusModalOrder, status)
                      }
                      disabled={!isNext}
                      style={{ justifyContent: "flex-start", opacity: isCurrent || isNext ? 1 : 0.4 }}
                    >
                      {STATUS_LABELS[status]}
                      {isCurrent && " (saat ini)"}
                      {isNext && " →"}
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
