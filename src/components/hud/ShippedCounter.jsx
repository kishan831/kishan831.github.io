export default function ShippedCounter({ shipped }) {
  return (
    <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--accent)]">
      {shipped} SHIPPED
    </span>
  )
}
