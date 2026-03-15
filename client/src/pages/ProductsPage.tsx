import { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../components/Toast";
import { useSort, thSort } from "../hooks/useSort";
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
    e.preventDefault(); setError("");
    if (farmerId === "" || commodityId === "" || gradeId === "") return;
    try {
      await api.createProduct({
        farmer_id: farmerId, commodity_id: commodityId, grade_id: gradeId,
        name, description: desc, stock: Number(stock), photo_url: photoUrl || undefined,
      });
      resetForm(); load();
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
    e.preventDefault(); setError("");
    if (!editProduct || editFarmerId === "" || editCommodityId === "" || editGradeId === "") return;
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
      <h2>Produk</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleAdd} style={formRow}>
        <select value={farmerId} onChange={(e) => setFarmerId(e.target.value ? Number(e.target.value) : "")} required style={inputStyle}>
          <option value="">Pilih petani *</option>
          {farmers.filter((f) => f.is_active).map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>

        <select value={commodityId} onChange={(e) => { setCommodityId(e.target.value ? Number(e.target.value) : ""); setGradeId(""); }} required style={inputStyle}>
          <option value="">Pilih komoditas *</option>
          {commodities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select value={gradeId} onChange={(e) => setGradeId(e.target.value ? Number(e.target.value) : "")} required style={inputStyle}>
          <option value="">Pilih grade *</option>
          {filteredGrades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>

        <input placeholder="Nama produk *" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
        <input placeholder="Deskripsi" value={desc} onChange={(e) => setDesc(e.target.value)} style={inputStyle} />
        <input type="number" placeholder="Stok" value={stock} onChange={(e) => setStock(e.target.value)} min={0} style={{ ...inputStyle, width: 80 }} />
        <input placeholder="URL Foto" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} style={inputStyle} />
        <button type="submit" style={btnStyle}>Tambah Produk</button>
      </form>

      {/* Filter bar */}
      <div style={{ ...formRow, marginBottom: 12, background: "#f1f5f9", padding: "10px 12px", borderRadius: 8 }}>
        <input placeholder="Cari nama / petani..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ ...inputStyle, minWidth: 180 }} />
        <select value={filterCommodity} onChange={(e) => setFilterCommodity(e.target.value ? Number(e.target.value) : "")} style={inputStyle}>
          <option value="">Semua komoditas</option>
          {commodities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterFarmer} onChange={(e) => setFilterFarmer(e.target.value ? Number(e.target.value) : "")} style={inputStyle}>
          <option value="">Semua petani</option>
          {farmers.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as "" | "active" | "inactive")} style={inputStyle}>
          <option value="">Semua status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thSort} onClick={() => sort.toggle("id")}>ID{sort.arrow("id")}</th>
            <th>Foto</th>
            <th style={thSort} onClick={() => sort.toggle("name")}>Nama{sort.arrow("name")}</th>
            <th style={thSort} onClick={() => sort.toggle("farmer_name")}>Petani{sort.arrow("farmer_name")}</th>
            <th style={thSort} onClick={() => sort.toggle("commodity_name")}>Komoditas{sort.arrow("commodity_name")}</th>
            <th style={thSort} onClick={() => sort.toggle("grade_name")}>Grade{sort.arrow("grade_name")}</th>
            <th style={thSort} onClick={() => sort.toggle("current_price")}>Harga{sort.arrow("current_price")}</th>
            <th style={thSort} onClick={() => sort.toggle("stock")}>Stok{sort.arrow("stock")}</th>
            <th style={thSort} onClick={() => sort.toggle("is_active")}>Status{sort.arrow("is_active")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sort.sorted(filtered).map((p) => (
            <tr key={p.id} style={{ opacity: p.is_active ? 1 : 0.55 }}>
              <td>{p.id}</td>
              <td>
                {p.photo_url ? (
                  <img
                    src={p.photo_url}
                    alt=""
                    style={{ width: 48, height: 48, objectFit: "cover", objectPosition: "center", borderRadius: 4, cursor: "pointer" }}
                    onClick={() => setPreviewUrl(p.photo_url)}
                  />
                ) : (
                  <span style={{ color: "#94a3b8" }}>—</span>
                )}
              </td>
              <td>
                <span style={{ cursor: "pointer", color: "#2563eb", textDecoration: "underline" }} onClick={() => setDetailProduct(p)}>
                  {p.name}
                </span>
              </td>
              <td>{p.farmer_name}</td>
              <td>{p.commodity_name}</td>
              <td>{p.grade_name}</td>
              <td>{fmt(p.current_price)}</td>
              <td>{p.stock}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button
                  onClick={() => toggleActive(p.id)}
                  style={{ ...btnStyle, background: p.is_active ? "#16a34a" : "#94a3b8", fontSize: 12, minWidth: 72, textAlign: "center" }}
                >
                  {p.is_active ? "Aktif" : "Nonaktif"}
                </button>
              </td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button onClick={() => openEdit(p)} style={{ ...btnStyle, background: "#f59e0b", fontSize: 12, minWidth: 52, textAlign: "center" }}>Edit</button>{" "}
                <button onClick={() => handleDelete(p.id)} style={{ ...dangerBtn, minWidth: 52, textAlign: "center" }}>Hapus</button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && <tr><td colSpan={10} style={{ textAlign: "center" }}>Belum ada produk</td></tr>}
        </tbody>
      </table>

      {/* Image preview lightbox */}
      {previewUrl && (
        <div
          onClick={() => setPreviewUrl(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, cursor: "pointer",
          }}
        >
          <img
            src={previewUrl}
            alt="Preview"
            style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
          />
        </div>
      )}

      {/* Detail popup */}
      {detailProduct && (
        <div onClick={() => setDetailProduct(null)} style={overlayStyle}>
          <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Detail Produk</h3>
              <button onClick={() => setDetailProduct(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>
            {detailProduct.photo_url ? (
              <img src={detailProduct.photo_url} alt={detailProduct.name} style={{ width: "100%", height: 260, objectFit: "cover", objectPosition: "center", borderRadius: 8, marginBottom: 16 }} />
            ) : (
              <div style={{ width: "100%", height: 260, borderRadius: 8, marginBottom: 16, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", fontSize: 14 }}>
                Tidak ada foto
              </div>
            )}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                {([
                  ["ID", detailProduct.id],
                  ["Nama", detailProduct.name],
                  ["Deskripsi", detailProduct.description || "—"],
                  ["Petani", detailProduct.farmer_name],
                  ["Komoditas", detailProduct.commodity_name],
                  ["Grade", detailProduct.grade_name],
                  ["Harga", fmt(detailProduct.current_price)],
                  ["Stok", detailProduct.stock],
                  ["Status", detailProduct.is_active ? "Aktif" : "Nonaktif"],
                  ["Dibuat", new Date(detailProduct.created_at).toLocaleString("id-ID")],
                  ["Diperbarui", new Date(detailProduct.updated_at).toLocaleString("id-ID")],
                ] as [string, string | number][]).map(([label, val]) => (
                  <tr key={label}>
                    <td style={{ padding: "6px 12px 6px 0", fontWeight: 600, color: "#64748b", whiteSpace: "nowrap", verticalAlign: "top" }}>{label}</td>
                    <td style={{ padding: "6px 0" }}>{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editProduct && (
        <div onClick={() => setEditProduct(null)} style={overlayStyle}>
          <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Edit Produk</h3>
              <button onClick={() => setEditProduct(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>
            <form onSubmit={handleEdit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label>
                <span style={labelStyle}>Petani</span>
                <select value={editFarmerId} onChange={(e) => setEditFarmerId(e.target.value ? Number(e.target.value) : "")} required style={modalInputStyle}>
                  <option value="">Pilih petani *</option>
                  {farmers.filter((f) => f.is_active).map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </label>
              <label>
                <span style={labelStyle}>Komoditas</span>
                <select value={editCommodityId} onChange={(e) => { setEditCommodityId(e.target.value ? Number(e.target.value) : ""); setEditGradeId(""); }} required style={modalInputStyle}>
                  <option value="">Pilih komoditas *</option>
                  {commodities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label>
                <span style={labelStyle}>Grade</span>
                <select value={editGradeId} onChange={(e) => setEditGradeId(e.target.value ? Number(e.target.value) : "")} required style={modalInputStyle}>
                  <option value="">Pilih grade *</option>
                  {editFilteredGrades.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </label>
              <label>
                <span style={labelStyle}>Nama Produk</span>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} required style={modalInputStyle} />
              </label>
              <label>
                <span style={labelStyle}>Deskripsi</span>
                <input value={editDesc} onChange={(e) => setEditDesc(e.target.value)} style={modalInputStyle} />
              </label>
              <label>
                <span style={labelStyle}>Stok</span>
                <input type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)} min={0} style={modalInputStyle} />
              </label>
              <label>
                <span style={labelStyle}>URL Foto</span>
                <input value={editPhotoUrl} onChange={(e) => setEditPhotoUrl(e.target.value)} style={modalInputStyle} />
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" style={btnStyle}>Simpan</button>
                <button type="button" onClick={() => setEditProduct(null)} style={{ ...btnStyle, background: "#94a3b8" }}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const formRow: React.CSSProperties = { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" };
const inputStyle: React.CSSProperties = { padding: "6px 10px", borderRadius: 4, border: "1px solid #cbd5e1" };
const btnStyle: React.CSSProperties = { padding: "6px 16px", borderRadius: 4, border: "none", background: "#2563eb", color: "#fff", cursor: "pointer" };
const dangerBtn: React.CSSProperties = { ...btnStyle, background: "#dc2626" };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 8, overflow: "hidden" };
const overlayStyle: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
};
const modalStyle: React.CSSProperties = {
  background: "#fff", borderRadius: 12, padding: 24, width: "100%", maxWidth: 520,
  maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
};
const modalInputStyle: React.CSSProperties = { display: "block", width: "100%", padding: "8px 10px", borderRadius: 4, border: "1px solid #cbd5e1", marginTop: 4 };
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#475569" };
