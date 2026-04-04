import { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../components/Toast";
import { useSort } from "../hooks/useSort";
import type { Product, Farmer, Commodity, Grade } from "../types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [commodities, setCommodities] = useState<Commodity[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const sort = useSort("id");

  // filters
  const [search, setSearch] = useState("");
  const [filterCommodity, setFilterCommodity] = useState<number | "">("");
  const [filterFarmer, setFilterFarmer] = useState<number | "">("");
  const [filterStatus, setFilterStatus] = useState<"" | "active" | "inactive">("");

  // create form
  const [farmerId, setFarmerId] = useState<number | "">("");
  const [commodityId, setCommodityId] = useState<number | "">("");
  const [gradeId, setGradeId] = useState<number | "">("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [stock, setStock] = useState("0");
  const [photoUrl, setPhotoUrl] = useState("");

  // edit form
  const [editFarmerId, setEditFarmerId] = useState<number | "">("");
  const [editCommodityId, setEditCommodityId] = useState<number | "">("");
  const [editGradeId, setEditGradeId] = useState<number | "">("");
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStock, setEditStock] = useState("0");
  const [editPhotoUrl, setEditPhotoUrl] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const load = async () => {
    try {
      const [p, f, c, g] = await Promise.all([
        api.getProducts(), api.getFarmers(), api.getCommodities(), api.getGrades(),
      ]);
      setProducts(p); setFarmers(f); setCommodities(c); setGrades(g);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
  };

  useEffect(() => { load(); }, []);

  const filteredGrades = commodityId !== "" ? grades.filter((g) => g.commodity_id === commodityId) : grades;
  const editFilteredGrades = editCommodityId !== "" ? grades.filter((g) => g.commodity_id === editCommodityId) : grades;

  const resetForm = () => {
    setFarmerId(""); setCommodityId(""); setGradeId("");
    setName(""); setDesc(""); setStock("0"); setPhotoUrl("");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (farmerId === "" || commodityId === "" || gradeId === "") return;
    if (!confirm("Simpan produk baru?")) return;
    setError("");
    try {
      await api.createProduct({
        farmer_id: farmerId, commodity_id: commodityId, grade_id: gradeId,
        name, description: desc, stock: Number(stock), photo_url: photoUrl || undefined,
      });
      resetForm(); setShowAddModal(false); load();
      showToast("Produk berhasil ditambahkan", "success");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setEditFarmerId(p.farmer_id);
    setEditCommodityId(p.commodity_id);
    setEditGradeId(p.grade_id);
    setEditName(p.name);
    setEditDesc(p.description || "");
    setEditStock(String(p.stock));
    setEditPhotoUrl(p.photo_url || "");
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct || editFarmerId === "" || editCommodityId === "" || editGradeId === "") return;
    if (!confirm("Simpan perubahan produk?")) return;
    setError("");
    try {
      await api.updateProduct(editProduct.id, {
        farmer_id: editFarmerId, commodity_id: editCommodityId, grade_id: editGradeId,
        name: editName, description: editDesc, stock: Number(editStock),
        photo_url: editPhotoUrl || undefined,
      });
      setEditProduct(null); load();
      showToast("Produk berhasil diperbarui", "success");
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const toggleActive = async (id: number) => {
    setError("");
    try { await api.toggleProduct(id); load(); showToast("Status produk diperbarui", "success"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus produk ini?")) return;
    try { await api.deleteProduct(id); load(); showToast("Produk berhasil dihapus", "success"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const fmt = (v: string | null | undefined) =>
    v ? Number(v).toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }) : "—";

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.farmer_name?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCommodity !== "" && p.commodity_id !== filterCommodity) return false;
    if (filterFarmer !== "" && p.farmer_id !== filterFarmer) return false;
    if (filterStatus === "active" && !p.is_active) return false;
    if (filterStatus === "inactive" && p.is_active) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Manajemen Produk</h1>
          <p className="page-subtitle">Kelola produk petani yang ditampilkan di marketplace</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Tambah Produk</button>
      </div>

      {error && <div className="alert alert-danger"><span>{error}</span></div>}

      <div className="filter-bar">
        <input placeholder="Cari nama / petani..." value={search} onChange={(e) => setSearch(e.target.value)} className="form-input" style={{ minWidth: 180 }} />
        <select value={filterCommodity} onChange={(e) => setFilterCommodity(e.target.value ? Number(e.target.value) : "")} className="form-select">
          <option value="">Semua komoditas</option>
          {commodities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterFarmer} onChange={(e) => setFilterFarmer(e.target.value ? Number(e.target.value) : "")} className="form-select">
          <option value="">Semua petani</option>
          {farmers.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as "" | "active" | "inactive")} className="form-select">
          <option value="">Semua status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
      </div>

      <div className="card">
        <table className="data-table">
          <thead>
            <tr>
              <th className="sortable" onClick={() => sort.toggle("name")}>Produk{sort.arrow("name")}</th>
              <th className="sortable" onClick={() => sort.toggle("farmer_name")}>Petani{sort.arrow("farmer_name")}</th>
              <th className="sortable" onClick={() => sort.toggle("commodity_name")}>Komoditas{sort.arrow("commodity_name")}</th>
              <th className="sortable" onClick={() => sort.toggle("grade_name")}>Grade{sort.arrow("grade_name")}</th>
              <th className="sortable" onClick={() => sort.toggle("current_price")}>Harga{sort.arrow("current_price")}</th>
              <th className="sortable" onClick={() => sort.toggle("stock")}>Stok{sort.arrow("stock")}</th>
              <th className="sortable" onClick={() => sort.toggle("is_active")}>Status{sort.arrow("is_active")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sort.sorted(filtered).map((p) => (
              <tr key={p.id} style={{ opacity: p.is_active ? 1 : 0.55 }}>
                <td>
                  <div className="product-cell">
                    {p.photo_url ? (
                      <img src={p.photo_url} alt="" className="product-cell-img" onClick={() => setPreviewUrl(p.photo_url)} />
                    ) : (
                      <div className="product-cell-img-placeholder">📦</div>
                    )}
                    <div>
                      <div className="product-cell-name" style={{ cursor: "pointer", color: "#2563eb" }} onClick={() => setDetailProduct(p)}>{p.name}</div>
                      <div className="product-cell-id">ID: P{String(p.id).padStart(3, "0")}</div>
                    </div>
                  </div>
                </td>
                <td>{p.farmer_name}</td>
                <td>{p.commodity_name}</td>
                <td>{p.grade_name}</td>
                <td style={{ fontWeight: 600 }}>{fmt(p.current_price)} {p.current_price && <span style={{ color: "#94a3b8", fontWeight: 400 }}>per kg</span>}</td>
                <td>{p.stock} kg</td>
                <td>
                  <button className={`badge ${p.is_active ? "badge-success" : "badge-muted"}`} onClick={() => toggleActive(p.id)} style={{ cursor: "pointer", border: "none" }}>
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
            {filtered.length === 0 && <tr><td colSpan={8} style={{ textAlign: "center", padding: 24, color: "#94a3b8" }}>Belum ada produk</td></tr>}
          </tbody>
        </table>
        <div className="table-footer">Menampilkan {filtered.length} dari {products.length} produk</div>
      </div>

      {/* Image preview lightbox */}
      {previewUrl && (
        <div className="lightbox" onClick={() => setPreviewUrl(null)}>
          <img src={previewUrl} alt="Preview" />
        </div>
      )}

      {/* Detail popup */}
      {detailProduct && (
        <div className="modal-overlay" onClick={() => setDetailProduct(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Detail Produk</h3>
              <button className="modal-close" onClick={() => setDetailProduct(null)}>✕</button>
            </div>
            {detailProduct.photo_url ? (
              <img src={detailProduct.photo_url} alt={detailProduct.name} style={{ width: "100%", height: 260, objectFit: "cover", borderRadius: 8, marginBottom: 16 }} />
            ) : (
              <div style={{ width: "100%", height: 260, borderRadius: 8, marginBottom: 16, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>Tidak ada foto</div>
            )}
            <table className="data-table">
              <tbody>
                {([
                  ["ID", `P${String(detailProduct.id).padStart(3, "0")}`],
                  ["Nama", detailProduct.name],
                  ["Deskripsi", detailProduct.description || "—"],
                  ["Petani", detailProduct.farmer_name],
                  ["Komoditas", detailProduct.commodity_name],
                  ["Grade", detailProduct.grade_name],
                  ["Harga", fmt(detailProduct.current_price)],
                  ["Stok", `${detailProduct.stock} kg`],
                  ["Status", detailProduct.is_active ? "Aktif" : "Nonaktif"],
                  ["Dibuat", new Date(detailProduct.created_at).toLocaleString("id-ID")],
                  ["Diperbarui", new Date(detailProduct.updated_at).toLocaleString("id-ID")],
                ] as [string, string | number][]).map(([label, val]) => (
                  <tr key={label}>
                    <td style={{ fontWeight: 600, color: "#64748b", whiteSpace: "nowrap" }}>{label}</td>
                    <td>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tambah Produk</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label className="form-label">Petani</label>
                <select value={farmerId} onChange={(e) => setFarmerId(e.target.value ? Number(e.target.value) : "")} required className="form-input-full">
                  <option value="">Pilih petani *</option>
                  {farmers.filter((f) => f.is_active).map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select></div>
              <div><label className="form-label">Komoditas</label>
                <select value={commodityId} onChange={(e) => { setCommodityId(e.target.value ? Number(e.target.value) : ""); setGradeId(""); }} required className="form-input-full">
                  <option value="">Pilih komoditas *</option>
                  {commodities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select></div>
              <div><label className="form-label">Grade</label>
                <select value={gradeId} onChange={(e) => setGradeId(e.target.value ? Number(e.target.value) : "")} required className="form-input-full">
                  <option value="">Pilih grade *</option>
                  {filteredGrades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select></div>
              <div><label className="form-label">Nama Produk</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="form-input-full" placeholder="Nama produk" /></div>
              <div><label className="form-label">Deskripsi</label>
                <input value={desc} onChange={(e) => setDesc(e.target.value)} className="form-input-full" placeholder="Deskripsi" /></div>
              <div><label className="form-label">Stok</label>
                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} min={0} className="form-input-full" /></div>
              <div><label className="form-label">URL Foto</label>
                <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} className="form-input-full" placeholder="https://..." /></div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary">Simpan</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editProduct && (
        <div className="modal-overlay" onClick={() => setEditProduct(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Produk</h3>
              <button className="modal-close" onClick={() => setEditProduct(null)}>✕</button>
            </div>
            <form onSubmit={handleEdit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><label className="form-label">Petani</label>
                <select value={editFarmerId} onChange={(e) => setEditFarmerId(e.target.value ? Number(e.target.value) : "")} required className="form-input-full">
                  <option value="">Pilih petani *</option>
                  {farmers.filter((f) => f.is_active).map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select></div>
              <div><label className="form-label">Komoditas</label>
                <select value={editCommodityId} onChange={(e) => { setEditCommodityId(e.target.value ? Number(e.target.value) : ""); setEditGradeId(""); }} required className="form-input-full">
                  <option value="">Pilih komoditas *</option>
                  {commodities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select></div>
              <div><label className="form-label">Grade</label>
                <select value={editGradeId} onChange={(e) => setEditGradeId(e.target.value ? Number(e.target.value) : "")} required className="form-input-full">
                  <option value="">Pilih grade *</option>
                  {editFilteredGrades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select></div>
              <div><label className="form-label">Nama Produk</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} required className="form-input-full" /></div>
              <div><label className="form-label">Deskripsi</label>
                <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="form-input-full" /></div>
              <div><label className="form-label">Stok</label>
                <input type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)} min={0} className="form-input-full" /></div>
              <div><label className="form-label">URL Foto</label>
                <input value={editPhotoUrl} onChange={(e) => setEditPhotoUrl(e.target.value)} className="form-input-full" /></div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary">Simpan</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditProduct(null)}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
