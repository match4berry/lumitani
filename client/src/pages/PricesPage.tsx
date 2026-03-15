import { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../components/Toast";
import { useSort, thSort } from "../hooks/useSort";
import type { CommodityPrice, Grade } from "../types";

export default function PricesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [prices, setPrices] = useState<CommodityPrice[]>([]);
  const [gradeId, setGradeId] = useState<number | "">("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  // edit states
  const [editPrice, setEditPrice] = useState<CommodityPrice | null>(null);
  const [editPriceVal, setEditPriceVal] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const sort = useSort("id");

  const load = async () => {
    try {
      const [g, p] = await Promise.all([api.getGrades(), api.getPrices()]);
      setGrades(g);
      setPrices(p);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (gradeId === "") return;
    try {
      await api.createPrice({ grade_id: gradeId, price: Number(price), start_date: startDate, end_date: endDate });
      setPrice(""); setStartDate(""); setEndDate("");
      load();
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

  return (
    <div>
      <h2>Harga Komoditas</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleAdd} style={formRow}>
        <select value={gradeId} onChange={(e) => setGradeId(e.target.value ? Number(e.target.value) : "")} required style={inputStyle}>
          <option value="">Pilih grade *</option>
          {grades.map((g) => <option key={g.id} value={g.id}>{g.commodity_name} — {g.name}</option>)}
        </select>
        <input type="number" placeholder="Harga *" value={price} onChange={(e) => setPrice(e.target.value)} required min={0} style={inputStyle} />
        <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
          Mulai <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={inputStyle} />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
          Selesai <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={inputStyle} />
        </label>
        <button type="submit" style={btnStyle}>Tambah Harga</button>
      </form>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thSort} onClick={() => sort.toggle("id")}>ID{sort.arrow("id")}</th>
            <th style={thSort} onClick={() => sort.toggle("commodity_name")}>Komoditas{sort.arrow("commodity_name")}</th>
            <th style={thSort} onClick={() => sort.toggle("grade_name")}>Grade{sort.arrow("grade_name")}</th>
            <th style={thSort} onClick={() => sort.toggle("price")}>Harga{sort.arrow("price")}</th>
            <th style={thSort} onClick={() => sort.toggle("start_date")}>Mulai{sort.arrow("start_date")}</th>
            <th style={thSort} onClick={() => sort.toggle("end_date")}>Selesai{sort.arrow("end_date")}</th>
            <th style={thSort} onClick={() => sort.toggle("is_active")}>Aktif{sort.arrow("is_active")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sort.sorted(prices).map((p) => (
            <tr key={p.id} style={{ opacity: p.is_active ? 1 : 0.5 }}>
              <td>{p.id}</td><td>{p.commodity_name}</td><td>{p.grade_name}</td>
              <td>{fmt(p.price)}</td><td>{p.start_date}</td><td>{p.end_date}</td>
              <td>
                <button onClick={() => toggleActive(p)} style={{ ...btnStyle, background: p.is_active ? "#16a34a" : "#94a3b8", fontSize: 12, minWidth: 72, textAlign: "center" }}>
                  {p.is_active ? "Aktif" : "Nonaktif"}
                </button>
              </td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button onClick={() => openEdit(p)} style={{ ...btnStyle, background: "#f59e0b", fontSize: 12, minWidth: 52 }}>Edit</button>{" "}
                <button onClick={() => handleDelete(p.id)} style={{ ...dangerBtn, minWidth: 52 }}>Hapus</button>
              </td>
            </tr>
          ))}
          {prices.length === 0 && <tr><td colSpan={8} style={{ textAlign: "center" }}>Belum ada harga</td></tr>}
        </tbody>
      </table>

      {/* Edit modal */}
      {editPrice && (
        <div onClick={() => setEditPrice(null)} style={overlayStyle}>
          <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Edit Harga</h3>
              <button onClick={() => setEditPrice(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>
            <p style={{ margin: "0 0 12px", color: "#64748b", fontSize: 14 }}>{editPrice.commodity_name} — {editPrice.grade_name}</p>
            <form onSubmit={handleEdit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label><span style={labelStyle}>Harga</span><input type="number" value={editPriceVal} onChange={(e) => setEditPriceVal(e.target.value)} required min={0} style={modalInputStyle} /></label>
              <label><span style={labelStyle}>Mulai</span><input type="date" value={editStart} onChange={(e) => setEditStart(e.target.value)} required style={modalInputStyle} /></label>
              <label><span style={labelStyle}>Selesai</span><input type="date" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} required style={modalInputStyle} /></label>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} />
                <span style={labelStyle}>Aktif</span>
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" style={btnStyle}>Simpan</button>
                <button type="button" onClick={() => setEditPrice(null)} style={{ ...btnStyle, background: "#94a3b8" }}>Batal</button>
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
  background: "#fff", borderRadius: 12, padding: 24, width: "100%", maxWidth: 480,
  maxHeight: "90vh", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
};
const modalInputStyle: React.CSSProperties = { display: "block", width: "100%", padding: "8px 10px", borderRadius: 4, border: "1px solid #cbd5e1", marginTop: 4 };
const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "#475569" };
