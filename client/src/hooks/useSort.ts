import { useState } from "react";

export function useSort(defaultKey: string, defaultDir: "asc" | "desc" = "asc") {
  const [sortKey, setSortKey] = useState(defaultKey);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultDir);

  const toggle = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  function sorted<T>(items: T[]): T[] {
    return [...items].sort((a, b) => {
      const av = (a as Record<string, unknown>)[sortKey];
      const bv = (b as Record<string, unknown>)[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const na = Number(av), nb = Number(bv);
      if (!isNaN(na) && !isNaN(nb)) return sortDir === "asc" ? na - nb : nb - na;
      const sa = String(av).toLowerCase(), sb = String(bv).toLowerCase();
      return sortDir === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
  }

  const arrow = (key: string) => (sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "");

  return { toggle, sorted, arrow };
}

export const thSort: React.CSSProperties = { cursor: "pointer", userSelect: "none" };
