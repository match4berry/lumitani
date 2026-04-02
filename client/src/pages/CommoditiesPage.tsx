import { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../components/Toast";
import type { Commodity, Grade, Product, CommodityPrice } from "../types";

export default function CommoditiesPage() {
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [comName, setComName] = useState("");
  const [comDesc, setComDesc] = useState("");
  const [gradeCom, setGradeCom] = useState<number | "">("");
  const [gradeName, setGradeName] = useState("");
  const [gradeDesc, setGradeDesc] = useState("");
  const [error, setError] = useState("");

  // edit states
  const [editCom, setEditCom] = useState<Commodity | null>(null);
  const [editComName, setEditComName] = useState("");
  const [editComDesc, setEditComDesc] = useState("");
  const [editGrade, setEditGrade] = useState<Grade | null>(null);
  const [editGradeCom, setEditGradeCom] = useState<number | "">("");
  const [editGradeName, setEditGradeName] = useState("");
  const [editGradeDesc, setEditGradeDesc] = useState("");
  const [showAddCom, setShowAddCom] = useState(false);
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [prices, setPrices] = useState<CommodityPrice[]>([]);

  const load = async () => {
    try {
      const [c, g, p, pr] = await Promise.all([api.getCommodities(), api.getGrades(), api.getProducts(), api.getPrices()]);
      setCommodities(c);
      setGrades(g);
      setProducts(p);
      setPrices(pr);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
  };

  useEffect(() => { load(); }, []);

  const addCommodity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm("Simpan komoditas baru?")) return;
    setError("");
    try { await api.createCommodity({ name: comName, description: comDesc }); setComName(""); setComDesc(""); setShowAddCom(false); load(); showToast("Komoditas berhasil ditambahkan", "success"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const addGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gradeCom === "") return;
    if (!confirm("Simpan grade baru?")) return;
    setError("");
    try { await api.createGrade({ commodity_id: gradeCom, name: gradeName, description: gradeDesc }); setGradeName(""); setGradeDesc(""); setShowAddGrade(false); load(); showToast("Grade berhasil ditambahkan", "success"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const openEditCom = (c: Commodity) => { setEditCom(c); setEditComName(c.name); setEditComDesc(c.description || ""); };
  const handleEditCom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCom) return;
    if (!confirm("Simpan perubahan komoditas?")) return;
    setError("");
    try { await api.updateCommodity(editCom.id, { name: editComName, description: editComDesc }); setEditCom(null); load(); showToast("Komoditas berhasil diperbarui", "success"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const openEditGrade = (g: Grade) => { setEditGrade(g); setEditGradeCom(g.commodity_id); setEditGradeName(g.name); setEditGradeDesc(g.description || ""); };
  const handleEditGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editGrade || editGradeCom === "") return;
    if (!confirm("Simpan perubahan grade?")) return;
    setError("");
    try { await api.updateGrade(editGrade.id, { commodity_id: editGradeCom, name: editGradeName, description: editGradeDesc }); setEditGrade(null); load(); showToast("Grade berhasil diperbarui", "success"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const delCommodity = async (id: number) => {
    if (!confirm("Hapus komoditas ini? Grade terkait juga akan terhapus.")) return;
    try { await api.deleteCommodity(id); load(); showToast("Komoditas berhasil dihapus", "success"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const delGrade = async (id: number) => {
    if (!confirm("Hapus grade ini?")) return;
    try { await api.deleteGrade(id); load(); showToast("Grade berhasil dihapus", "success"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const getProductCount = (comId: number) => products.filter(p => p.commodity_id === comId).length;
  const getActivePriceCount = (comId: number) => {
    const comGrades = grades.filter(g => g.commodity_id === comId);
    return prices.filter(p => p.is_active && comGrades.some(g => g.id === p.grade_id)).length;
  };
  const getGradesForCommodity = (comId: number) => grades.filter(g => g.commodity_id === comId);

  const uniqueDescs = [...new Set(commodities.map(c => c.description).filter(Boolean))];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manajemen Komoditas & Grade</h1>
          <p className="page-subtitle">Kelola jenis komoditas dan klasifikasi grade</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" onClick={() => setShowAddCom(true)}>+ Tambah Komoditas</button>
          <button className="btn btn-secondary" onClick={() => setShowAddGrade(true)}>+ Tambah Grade</button>
        </div>
      </div>

      {error && <div className="alert alert-danger"><span>{error}</span></div>}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Komoditas</span>
            <div className="stat-card-icon" style={{ background: "#dcfce7" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
          </div>
          <div className="stat-card-value">{commodities.length}</div>
          <div className="stat-card-desc">Jenis komoditas terdaftar</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Grade</span>
            <div className="stat-card-icon" style={{ background: "#dbeafe" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
          </div>
          <div className="stat-card-value">{grades.length}</div>
          <div className="stat-card-desc">Klasifikasi grade tersedia</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Kategori</span>
            <div className="stat-card-icon" style={{ background: "#fef3c7" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </div>
          </div>
          <div className="stat-card-value">{uniqueDescs.length || commodities.length}</div>
          <div className="stat-card-desc">Kategori komoditas</div>
        </div>
      </div>

      <div className="commodity-cards">
        {commodities.map((c) => {
          const comGrades = getGradesForCommodity(c.id);
          const prodCount = getProductCount(c.id);
          const activePriceCount = getActivePriceCount(c.id);
          return (
            <div key={c.id} className="commodity-card">
              <div className="commodity-card-header">
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{c.name}</div>
                  {c.description && <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{c.description}</div>}
                </div>
                <div className="action-buttons">
                  <button className="btn-ghost" onClick={() => openEditCom(c)} title="Edit">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button className="btn-ghost" onClick={() => delCommodity(c.id)} title="Hapus" style={{ color: "#dc2626" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
              <div className="commodity-card-body">
                <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>Klasifikasi Grade ({comGrades.length})</div>
                <div className="grade-badges">
                  {comGrades.map(g => (
                    <span key={g.id} className="grade-badge" style={{ cursor: "pointer" }} onClick={() => openEditGrade(g)} title={`Edit: ${g.name}`}>
                      {g.name}
                    </span>
                  ))}
                  {comGrades.length === 0 && <span style={{ fontSize: 12, color: "#94a3b8" }}>Belum ada grade</span>}
                </div>
                <div className="commodity-card-stats">
                  <div className="commodity-stat">
                    <div className="commodity-stat-label">Produk</div>
                    <div className="commodity-stat-value">{prodCount}</div>
                  </div>
                  <div className="commodity-stat">
                    <div className="commodity-stat-label">Harga Aktif</div>
                    <div className="commodity-stat-value">{activePriceCount}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {commodities.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Belum ada komoditas</div>
      )}

      {/* Add Commodity modal */}
      {showAddCom && (
        <div className="modal-overlay" onClick={() => setShowAddCom(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Komoditas</h3>
              <button className="modal-close" onClick={() => setShowAddCom(false)}>✕</button>
            </div>
            <form onSubmit={addCommodity} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label className="form-label">Nama Komoditas</label>
                <input value={comName} onChange={(e) => setComName(e.target.value)} required className="form-input-full" placeholder="Nama komoditas" /></div>
              <div><label className="form-label">Deskripsi / Kategori</label>
                <input value={comDesc} onChange={(e) => setComDesc(e.target.value)} className="form-input-full" placeholder="Mis: Padi-padian, Sayuran" /></div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary">Simpan</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddCom(false)}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Grade modal */}
      {showAddGrade && (
        <div className="modal-overlay" onClick={() => setShowAddGrade(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Grade</h3>
              <button className="modal-close" onClick={() => setShowAddGrade(false)}>✕</button>
            </div>
            <form onSubmit={addGrade} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label className="form-label">Komoditas</label>
                <select value={gradeCom} onChange={(e) => setGradeCom(e.target.value ? Number(e.target.value) : "")} required className="form-input-full">
                  <option value="">Pilih komoditas *</option>
                  {commodities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select></div>
              <div><label className="form-label">Nama Grade</label>
                <input value={gradeName} onChange={(e) => setGradeName(e.target.value)} required className="form-input-full" placeholder="Mis: Premium, A, B" /></div>
              <div><label className="form-label">Deskripsi</label>
                <input value={gradeDesc} onChange={(e) => setGradeDesc(e.target.value)} className="form-input-full" placeholder="Deskripsi grade" /></div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary">Simpan</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddGrade(false)}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Commodity modal */}
      {editCom && (
        <div className="modal-overlay" onClick={() => setEditCom(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Komoditas</h3>
              <button className="modal-close" onClick={() => setEditCom(null)}>✕</button>
            </div>
            <form onSubmit={handleEditCom} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label className="form-label">Nama</label>
                <input value={editComName} onChange={(e) => setEditComName(e.target.value)} required className="form-input-full" /></div>
              <div><label className="form-label">Deskripsi</label>
                <input value={editComDesc} onChange={(e) => setEditComDesc(e.target.value)} className="form-input-full" /></div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary">Simpan</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditCom(null)}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Grade modal */}
      {editGrade && (
        <div className="modal-overlay" onClick={() => setEditGrade(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Grade</h3>
              <button className="modal-close" onClick={() => setEditGrade(null)}>✕</button>
            </div>
            <form onSubmit={handleEditGrade} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label className="form-label">Komoditas</label>
                <select value={editGradeCom} onChange={(e) => setEditGradeCom(e.target.value ? Number(e.target.value) : "")} required className="form-input-full">
                  <option value="">Pilih komoditas *</option>
                  {commodities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select></div>
              <div><label className="form-label">Nama Grade</label>
                <input value={editGradeName} onChange={(e) => setEditGradeName(e.target.value)} required className="form-input-full" /></div>
              <div><label className="form-label">Deskripsi</label>
                <input value={editGradeDesc} onChange={(e) => setEditGradeDesc(e.target.value)} className="form-input-full" /></div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary">Simpan</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditGrade(null)}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
