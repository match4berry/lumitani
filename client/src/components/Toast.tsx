import { useEffect, useState } from "react";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

let nextId = 1;
let listener: ((toasts: Toast[]) => void) | null = null;
let current: Toast[] = [];

function emit() {
  listener?.([...current]);
}

export function showToast(message: string, type: "success" | "error" = "success") {
  const id = nextId++;
  current.push({ id, message, type });
  emit();
  setTimeout(() => {
    current = current.filter((t) => t.id !== id);
    emit();
  }, 3000);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    listener = setToasts;
    return () => { listener = null; };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 2000, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            color: "#fff",
            background: t.type === "success" ? "#16a34a" : "#dc2626",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontSize: 14,
            fontWeight: 500,
            animation: "fadeIn 0.2s ease",
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
