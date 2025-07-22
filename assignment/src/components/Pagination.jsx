export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;

  const clamp = n => Math.min(Math.max(1, n), pages);
  const click = n => () => onChange(clamp(n));

  return (
    <nav className="pagination">
      <button onClick={click(page - 1)} disabled={page === 1}>
        ‹ Prev
      </button>

      <span className="page-indicator">
        Page : {page}
      </span>

      <button onClick={click(page + 1)} disabled={page === pages}>
        Next ›
      </button>
    </nav>
  );
}
