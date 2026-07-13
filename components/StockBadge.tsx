export default function StockBadge({
  stock,
  className = "",
}: {
  stock: number;
  className?: string;
}) {
  if (stock <= 0) {
    return (
      <span className={`font-data text-xs text-[#ff4444] ${className}`}>
        Sold out
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span
        className={`font-data text-xs text-[var(--accent-2)] ${className}`}
      >
        Only {stock} left!
      </span>
    );
  }

  return (
    <span className={`font-data text-xs text-[var(--text-dim)] ${className}`}>
      {stock} in stock
    </span>
  );
}
