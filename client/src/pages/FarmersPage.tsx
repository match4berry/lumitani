import { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../components/Toast";
import { useSort } from "../hooks/useSort";
import type { Farmer, Product } from "../types";

export default function FarmersPage() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [editFarmer, setEditFarmer] = useState<Farmer | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const sort = useSort("id");

  const load = () => {
    api.getFarmers().then(setFarmers).catch((e) => setError(e.message));
    api.getProducts().then(setProducts).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.createFarmer({ name, phone, address });
      setName(""); setPhone(""); setAddress("");
      setShowAddModal(false); load();
      showToast("Petani berhasil ditambahkan", "success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  };

  const openEdit = (f: Farmer) => {
    setEditFarmer(f);
    setEditName(f.name);
    setEditPhone(f.phone || "");
    setEditAddress(f.address || "");
    setEditIsActive(f.is_active);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!editFarmer) return;
    try {
      await api.updateFarmer(editFarmer.id, { name: editName, phone: editPhone, address: editAddress, is_active: editIsActive });
      setEditFarmer(null); load();
      showToast("Petani berhasil diperbarui", "success");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus petani ini?")) return;
    try { await api.deleteFarmer(id); load(); showToast("Petani berhasil dihapus", "success"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const activeFarmers = farmers.filter(f => f.is_active);
  const totalProducts = products.length;
  const avgProducts = farmers.length > 0 ? (totalProducts / farmers.length).toFixed(1) : "0";
  const getProductCount = (farmerId: number) => products.filter(p => p.farmer_id === farmerId).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manajemen Petani</h1>
          <p className="page-subtitle">Kelola data petani dan produk mereka</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Tambah Petani</button>
      </div>

      {error && <div className="alert alert-danger"><span>{error}</span></div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Petani</span>
            <div className="stat-card-icon" style={{ background: "#dcfce7" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
          </div>
          <div className="stat-card-value">{farmers.length}</div>
          <div className="stat-card-desc">{activeFarmers.length} aktif</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Produk</span>
            <div className="stat-card-icon" style={{ background: "#dbeafe" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            </div>
          </div>
          <div className="stat-card-value">{totalProducts}</div>
          <div className="stat-card-desc">Dari semua petani</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Rata-rata Produk</span>
            <div className="stat-card-icon" style={{ background: "#fef3c7" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
          </div>
          <div className="stat-card-value">{avgProducts}</div>
          <div className="stat-card-desc">Produk per petani</div>
        </div>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => sort.toggle("id")}>ID{sort.arrow("id")}</th>
              <th className="sortable" onClick={() => sort.toggle("name")}>Nama{sort.arrow("name")}</th>
              <th className="sortable" onClick={() => sort.toggle("phone")}>Telepon{sort.arrow("phone")}</th>
              <th className="sortable" onClick={() => sort.toggle("address")}>Alamat{sort.arrow("address")}</th>
              <th>Produk</th>
              <th className="sortable" onClick={() => sort.toggle("is_active")}>Status{sort.arrow("is_active")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sort.sorted(farmers).map((f) => (
              <tr key={f.id}>
                <td style={{ color: "#64748b" }}>F{String(f.id).padStart(3, "0")}</td>
                <td style={{ fontWeight: 600 }}>{f.name}</td>
                <td>{f.phone || "\u2014"}</td>
                <td>{f.address || "\u2014"}</td>
                <td>{getProductCount(f.id)}</td>
                <td>
                  <span className={`badge ${f.is_active ? "badge-success" : "badge-muted"}`}>
                    {f.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-warning btn-sm" onClick={() => openEdit(f)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id)}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
            {farmers.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>Belum ada petani</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Add modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Petani</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>\u2715</button>
            </div>
            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label className="form-label">Nama</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="form-input-full" placeholder="Nama petani" /></div>
              <div><label className="form-label">Telepon</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="form-input-full" placeholder="08xxxxxxxxxx" /></div>
              <div><label className="form-label">Alamat</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} className="form-input-full" placeholder="Alamat lengkap" /></div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary">Simpan</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editFarmer && (
        <div className="modal-overlay" onClick={() => setEditFarmer(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Petani</h3>
              <button className="modal-close" onClick={() => setEditFarmer(null)}>\u2715</button>
            </div>
            <form onSubmit={handleEdit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label className="form-label">Nama</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} required className="form-input-full" /></div>
              <div><label className="form-label">Telepon</label>
                <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="form-input-full" /></div>
              <div><label className="form-label">Alamat</label>
                <input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} className="form-input-full" /></div>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} />
                <span className="form-label" style={{ marginBottom: 0 }}>Aktif</span>
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary">Simpan</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditFarmer(null)}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
