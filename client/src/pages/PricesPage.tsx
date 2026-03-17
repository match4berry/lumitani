import { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../components/Toast";
import type { CommodityPrice, Grade, Commodity } from "../types";

export default function PricesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [prices, setPrices] = useState<CommodityPrice[]>([]);
  const [gradeId, setGradeId] = useState<number | "">("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [filterCommodity, setFilterCommodity] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  // edit states
  const [editPrice, setEditPrice] = useState<CommodityPrice | null>(null);
  const [editPriceVal, setEditPriceVal] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);

  const load = async () => {
    try {
      const [g, p, c] = await Promise.all([api.getGrades(), api.getPrices(), api.getCommodities()]);
      setGrades(g);
      setPrices(p);
      setCommodities(c);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (gradeId === "") return;
    try {
      await api.createPrice({ grade_id: gradeId, price: Number(price), start_date: startDate, end_date: endDate });
      setPrice(""); setStartDate(""); setEndDate("");
      setShowAddModal(false); load();
      showToast("Harga berhasil ditambahkan", "success");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const openEdit = (p: CommodityPrice) => {
    setEditPrice(p);
    setEditPriceVal(String(p.price));
    setEditStart(p.start_date);
    setEditEnd(p.end_date);
    setEditIsActive(p.is_active);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!editPrice) return;
    try {
      await api.updatePrice(editPrice.id, { price: Number(editPriceVal), start_date: editStart, end_date: editEnd, is_active: editIsActive });
      setEditPrice(null); load();
      showToast("Harga berhasil diperbarui", "success");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const toggleActive = async (p: CommodityPrice) => {
    setError("");
    try {
      await api.updatePrice(p.id, {
        price: Number(p.price), start_date: p.start_date, end_date: p.end_date,
        is_active: !p.is_active,
      });
      load();
      showToast("Status harga diperbarui", "success");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus harga ini?")) return;
    try { await api.deletePrice(id); load(); showToast("Harga berhasil dihapus", "success"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const fmt = (v: string) => Number(v).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });

  // Group prices by commodity
  const groupedPrices: Record<string, CommodityPrice[]> = {};
  for (const p of prices) {
    const key = p.commodity_name || "Lainnya";
    if (!groupedPrices[key]) groupedPrices[key] = [];
    groupedPrices[key].push(p);
  }

  // Commodities without active prices
  const commoditiesWithoutActive = commodities.filter(c => {
    const comPrices = prices.filter(p => p.commodity_name === c.name);
    return comPrices.length === 0 || !comPrices.some(p => p.is_active);
  });

  const filteredGroups = Object.entries(groupedPrices).filter(([name, items]) => {
    if (filterCommodity && name !== filterCommodity) return false;
    if (filterStatus === "active" && !items.some(p => p.is_active)) return false;
    if (filterStatus === "inactive" && items.some(p => p.is_active)) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manajemen Harga Kolektif</h1>
          <p className="page-subtitle">Kelola harga standar komoditas pertanian</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Tambah Harga</button>
      </div>

      {error && <div className="alert alert-danger"><span>{error}</span></div>}

      {commoditiesWithoutActive.length > 0 && (
        <div className="alert alert-warning">
          <span>⚠️</span>
          <span><strong>Peringatan</strong> — {commoditiesWithoutActive.length} komoditas tidak memiliki harga aktif: {commoditiesWithoutActive.map(c => c.name).join(", ")}</span>
        </div>
      )}

      <div className="info-card">
        <h4>📋 Aturan Penetapan Harga</h4>
        <ul>
          <li>Hanya SATU harga aktif per komoditas dan grade pada periode yang sama</li>
          <li>Produk yang belum memiliki harga aktif tidak dapat dipublikasi</li>
          <li>Riwayat perubahan harga tersimpan otomatis</li>
        </ul>
      </div>

      <div className="filter-bar">
        <select value={filterCommodity} onChange={(e) => setFilterCommodity(e.target.value)} className="form-select">
          <option value="">Semua Komoditas</option>
          {Object.keys(groupedPrices).map(name => <option key={name} value={name}>{name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="form-select">
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
      </div>

      {filteredGroups.map(([comName, comPrices]) => (
        <div key={comName} className="card commodity-section">
          <div className="commodity-section-header">
            <div className="commodity-section-title">
              <span>🌾</span>
              <span>{comName}</span>
            </div>
            <span style={{ fontSize: 13, color: "#64748b" }}>Riwayat Harga</span>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Grade</th>
                <th>Harga</th>
                <th>Periode</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {comPrices.map((p) => (
                <tr key={p.id} style={{ opacity: p.is_active ? 1 : 0.55 }}>
                  <td><span className="badge badge-info">{p.grade_name}</span></td>
                  <td style={{ fontWeight: 600 }}>{fmt(p.price)} <span style={{ color: "#94a3b8", fontWeight: 400 }}>per kg</span></td>
                  <td style={{ color: "#64748b" }}>
                    {new Date(p.start_date).toLocaleDateString("id-ID")} s/d {new Date(p.end_date).toLocaleDateString("id-ID")}
                  </td>
                  <td>
                    <button
                      className={`badge ${p.is_active ? "badge-success" : "badge-muted"}`}
                      onClick={() => toggleActive(p)}
                      style={{ cursor: "pointer", border: "none" }}
                    >
                      {p.is_active ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-warning btn-sm" onClick={() => openEdit(p)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {filteredGroups.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Belum ada data harga</div>
      )}

      {/* Add modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Harga</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label className="form-label">Grade Komoditas</label>
                <select value={gradeId} onChange={(e) => setGradeId(e.target.value ? Number(e.target.value) : "")} required className="form-input-full">
                  <option value="">Pilih grade *</option>
                  {grades.map((g) => <option key={g.id} value={g.id}>{g.commodity_name} — {g.name}</option>)}
                </select></div>
              <div><label className="form-label">Harga (Rp)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min={0} className="form-input-full" placeholder="0" /></div>
              <div><label className="form-label">Tanggal Mulai</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="form-input-full" /></div>
              <div><label className="form-label">Tanggal Selesai</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="form-input-full" /></div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary">Simpan</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editPrice && (
        <div className="modal-overlay" onClick={() => setEditPrice(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Harga</h3>
              <button className="modal-close" onClick={() => setEditPrice(null)}>✕</button>
            </div>
            <p style={{ margin: "0 0 12px", color: "#64748b", fontSize: 14 }}>{editPrice.commodity_name} — {editPrice.grade_name}</p>
            <form onSubmit={handleEdit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label className="form-label">Harga (Rp)</label>
                <input type="number" value={editPriceVal} onChange={(e) => setEditPriceVal(e.target.value)} required min={0} className="form-input-full" /></div>
              <div><label className="form-label">Tanggal Mulai</label>
                <input type="date" value={editStart} onChange={(e) => setEditStart(e.target.value)} required className="form-input-full" /></div>
              <div><label className="form-label">Tanggal Selesai</label>
                <input type="date" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} required className="form-input-full" /></div>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} />
                <span className="form-label" style={{ marginBottom: 0 }}>Aktif</span>
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary">Simpan</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditPrice(null)}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
