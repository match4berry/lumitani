import { NavLink, Outlet } from "react-router-dom";
import ToastContainer from "./components/Toast";

const links = [
  { to: "/", label: "Produk" },
  { to: "/farmers", label: "Petani" },
  { to: "/commodities", label: "Komoditas & Grade" },
  { to: "/prices", label: "Harga" },
];

export default function Layout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <nav style={{
        width: 220, background: "#1e293b", color: "#fff",
        padding: "24px 0", display: "flex", flexDirection: "column", gap: 4,
      }}>
        <div style={{ padding: "0 20px", marginBottom: 24, fontWeight: 700, fontSize: 18 }}>
          Lumitani
        </div>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            style={({ isActive }) => ({
              padding: "10px 20px", color: isActive ? "#38bdf8" : "#cbd5e1",
              textDecoration: "none", background: isActive ? "#334155" : "transparent",
              fontWeight: isActive ? 600 : 400,
            })}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <main style={{ flex: 1, padding: 32, background: "#f1f5f9" }}>
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}
