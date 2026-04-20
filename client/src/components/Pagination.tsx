const PAGE_SIZE = 10;

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  label?: string;
}

export default function Pagination({ currentPage, totalItems, onPageChange, label = "data" }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, totalItems);

  if (totalItems === 0) return null;

  return (
    <div className="table-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
      <span>Menampilkan {start}–{end} dari {totalItems} {label}</span>
      {totalPages > 1 && (
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <button className="btn btn-secondary btn-sm" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={`btn btn-sm ${p === currentPage ? "btn-primary" : "btn-secondary"}`} onClick={() => onPageChange(p)}>{p}</button>
          ))}
          <button className="btn btn-secondary btn-sm" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>›</button>
        </div>
      )}
    </div>
  );
}

export { PAGE_SIZE };
