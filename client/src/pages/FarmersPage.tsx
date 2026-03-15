import { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../components/Toast";
import { useSort, thSort } from "../hooks/useSort";
import type { Farmer } from "../types";

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
  const sort = useSort("id");

  const load = () => api.getFarmers().then(setFarmers).catch((e) => setError(e.message));

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await api.createFarmer({ name, phone, address });
      setName(""); setPhone(""); setAddress("");
      load();
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

  return (
    <div>
      <h2>Petani</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input placeholder="Nama *" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
        <input placeholder="Telepon" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
        <input placeholder="Alamat" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
        <button type="submit" style={btnStyle}>Tambah</button>
      </form>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thSort} onClick={() => sort.toggle("id")}>ID{sort.arrow("id")}</th>
            <th style={thSort} onClick={() => sort.toggle("name")}>Nama{sort.arrow("name")}</th>
            <th style={thSort} onClick={() => sort.toggle("phone")}>Telepon{sort.arrow("phone")}</th>
            <th style={thSort} onClick={() => sort.toggle("address")}>Alamat{sort.arrow("address")}</th>
            <th style={thSort} onClick={() => sort.toggle("is_active")}>Aktif{sort.arrow("is_active")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sort.sorted(farmers).map((f) => (
            <tr key={f.id}>
              <td>{f.id}</td><td>{f.name}</td><td>{f.phone}</td><td>{f.address}</td>
              <td>{f.is_active ? "Ya" : "Tidak"}</td>
              <td style={{ whiteSpace: "nowrap" }}>
                <button onClick={() => openEdit(f)} style={{ ...btnStyle, background: "#f59e0b", fontSize: 12, minWidth: 52 }}>Edit</button>{" "}
                <button onClick={() => handleDelete(f.id)} style={{ ...dangerBtn, minWidth: 52 }}>Hapus</button>
              </td>
            </tr>
          ))}
          {farmers.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center" }}>Belum ada petani</td></tr>}
        </tbody>
      </table>

      {/* Edit modal */}
      {editFarmer && (
        <div onClick={() => setEditFarmer(null)} style={overlayStyle}>
          <div onClick={(e) => e.stopPropagation()} style={modalStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Edit Petani</h3>
              <button onClick={() => setEditFarmer(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>
            <form onSubmit={handleEdit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label>
                <span style={labelStyle}>Nama</span>
                <input value={editName} onChange={(e) => setEditName(e.target.value)} required style={modalInputStyle} />
              </label>
              <label>
                <span style={labelStyle}>Telepon</span>
                <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} style={modalInputStyle} />
              </label>
              <label>
                <span style={labelStyle}>Alamat</span>
                <input value={editAddress} onChange={(e) => setEditAddress(e.target.value)} style={modalInputStyle} />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="checkbox" checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} />
                <span style={labelStyle}>Aktif</span>
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="submit" style={btnStyle}>Simpan</button>
                <button type="button" onClick={() => setEditFarmer(null)} style={{ ...btnStyle, background: "#94a3b8" }}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

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
