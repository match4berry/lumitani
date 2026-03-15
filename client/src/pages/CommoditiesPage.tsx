import { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../components/Toast";
import { useSort, thSort } from "../hooks/useSort";
import type { Commodity, Grade } from "../types";

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
  const comSort = useSort("id");
  const gradeSort = useSort("id");

  const load = async () => {
    try {
      const [c, g] = await Promise.all([api.getCommodities(), api.getGrades()]);
      setCommodities(c);
      setGrades(g);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
  };

  useEffect(() => { load(); }, []);

  const addCommodity = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    try { await api.createCommodity({ name: comName, description: comDesc }); setComName(""); setComDesc(""); load(); showToast("Komoditas berhasil ditambahkan", "success"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const addGrade = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (gradeCom === "") return;
    try { await api.createGrade({ commodity_id: gradeCom, name: gradeName, description: gradeDesc }); setGradeName(""); setGradeDesc(""); load(); showToast("Grade berhasil ditambahkan", "success"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const openEditCom = (c: Commodity) => { setEditCom(c); setEditComName(c.name); setEditComDesc(c.description || ""); };
  const handleEditCom = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!editCom) return;
    try { await api.updateCommodity(editCom.id, { name: editComName, description: editComDesc }); setEditCom(null); load(); showToast("Komoditas berhasil diperbarui", "success"); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : "Failed"); }
  };

  const openEditGrade = (g: Grade) => { setEditGrade(g); setEditGradeCom(g.commodity_id); setEditGradeName(g.name); setEditGradeDesc(g.description || ""); };
  const handleEditGrade = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!editGrade || editGradeCom === "") return;
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

  return (
    <div>
      <h2>Komoditas</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={addCommodity} style={formRow}>
        <input placeholder="Nama komoditas *" value={comName} onChange={(e) => setComName(e.target.value)} required style={inputStyle} />
        <input placeholder="Deskripsi" value={comDesc} onChange={(e) => setComDesc(e.target.value)} style={inputStyle} />
        <button type="submit" style={btnStyle}>Tambah Komoditas</button>
      </form>

      <table style={tableStyle}>
        <thead><tr>
          <th style={thSort} onClick={() => comSort.toggle("id")}>ID{comSort.arrow("id")}</th>
          <th style={thSort} onClick={() => comSort.toggle("name")}>Nama{comSort.arrow("name")}</th>
          <th style={thSort} onClick={() => comSort.toggle("description")}>Deskripsi{comSort.arrow("description")}</th>
          <th></th>
        </tr></thead>
        <tbody>
          {comSort.sorted(commodities).map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td><td>{c.name}</td><td>{c.description}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button onClick={() => openEditCom(c)} style={{ ...btnStyle, background: "#f59e0b", fontSize: 12, minWidth: 52 }}>Edit</button>{" "}
                <button onClick={() => delCommodity(c.id)} style={{ ...dangerBtn, minWidth: 52 }}>Hapus</button>
              </td>
            </tr>
          ))}
          {commodities.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center" }}>Belum ada komoditas</td></tr>}
        </tbody>
      </table>

      <h2 style={{ marginTop: 32 }}>Grade</h2>

      <form onSubmit={addGrade} style={formRow}>
        <select value={gradeCom} onChange={(e) => setGradeCom(e.target.value ? Number(e.target.value) : "")} required style={inputStyle}>
          <option value="">Pilih komoditas *</option>
          {commodities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Nama grade *" value={gradeName} onChange={(e) => setGradeName(e.target.value)} required style={inputStyle} />
        <input placeholder="Deskripsi" value={gradeDesc} onChange={(e) => setGradeDesc(e.target.value)} style={inputStyle} />
        <button type="submit" style={btnStyle}>Tambah Grade</button>
      </form>

      <table style={tableStyle}>
        <thead><tr>
          <th style={thSort} onClick={() => gradeSort.toggle("id")}>ID{gradeSort.arrow("id")}</th>
          <th style={thSort} onClick={() => gradeSort.toggle("commodity_name")}>Komoditas{gradeSort.arrow("commodity_name")}</th>
          <th style={thSort} onClick={() => gradeSort.toggle("name")}>Grade{gradeSort.arrow("name")}</th>
          <th style={thSort} onClick={() => gradeSort.toggle("description")}>Deskripsi{gradeSort.arrow("description")}</th>
          <th></th>
        </tr></thead>
        <tbody>
          {gradeSort.sorted(grades).map((g) => (
            <tr key={g.id}>
              <td>{g.id}</td><td>{g.commodity_name}</td><td>{g.name}</td><td>{g.description}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button onClick={() => openEditGrade(g)} style={{ ...btnStyle, background: "#f59e0b", fontSize: 12, minWidth: 52 }}>Edit</button>{" "}
                <button onClick={() => delGrade(g.id)} style={{ ...dangerBtn, minWidth: 52 }}>Hapus</button>
              </td>
            </tr>
          ))}
          {grades.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center" }}>Belum ada grade</td></tr>}
        </tbody>
      </table>

      {/* Edit Commodity modal */}
      {editCom && (
        <div onClick={() => setEditCom(null)} style={overlayStyle}>
          <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Edit Komoditas</h3>
              <button onClick={() => setEditCom(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>
            <form onSubmit={handleEditCom} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label><span style={labelStyle}>Nama</span><input value={editComName} onChange={(e) => setEditComName(e.target.value)} required style={modalInputStyle} /></label>
              <label><span style={labelStyle}>Deskripsi</span><input value={editComDesc} onChange={(e) => setEditComDesc(e.target.value)} style={modalInputStyle} /></label>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" style={btnStyle}>Simpan</button>
                <button type="button" onClick={() => setEditCom(null)} style={{ ...btnStyle, background: "#94a3b8" }}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Grade modal */}
      {editGrade && (
        <div onClick={() => setEditGrade(null)} style={overlayStyle}>
          <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Edit Grade</h3>
              <button onClick={() => setEditGrade(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>
            <form onSubmit={handleEditGrade} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label>
                <span style={labelStyle}>Komoditas</span>
                <select value={editGradeCom} onChange={(e) => setEditGradeCom(e.target.value ? Number(e.target.value) : "")} required style={modalInputStyle}>
                  <option value="">Pilih komoditas *</option>
                  {commodities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label><span style={labelStyle}>Nama Grade</span><input value={editGradeName} onChange={(e) => setEditGradeName(e.target.value)} required style={modalInputStyle} /></label>
              <label><span style={labelStyle}>Deskripsi</span><input value={editGradeDesc} onChange={(e) => setEditGradeDesc(e.target.value)} style={modalInputStyle} /></label>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" style={btnStyle}>Simpan</button>
                <button type="button" onClick={() => setEditGrade(null)} style={{ ...btnStyle, background: "#94a3b8" }}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const formRow: React.CSSProperties = { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" };
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
