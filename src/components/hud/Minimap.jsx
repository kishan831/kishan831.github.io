/** Decorative progress plot. The marker rides a diagonal as screens are visited. */
export default function Minimap({ ratio }) {
  const x = 6 + ratio * 52
  const y = 40 - ratio * 30

  return (
    <svg
      data-testid="minimap"
      aria-hidden="true"
      viewBox="0 0 64 46"
      className="h-12 w-16 rounded-md border border-bone/10 bg-ink-950/60"
    >
      {[10, 20, 30].map((gy) => (
        <line key={gy} x1="0" y1={gy} x2="64" y2={gy} stroke="currentColor" strokeWidth="0.4" className="text-bone/10" />
      ))}
      {[16, 32, 48].map((gx) => (
        <line key={gx} x1={gx} y1="0" x2={gx} y2="46" stroke="currentColor" strokeWidth="0.4" className="text-bone/10" />
      ))}
      <path d="M6 40 L58 10" stroke="var(--accent)" strokeWidth="1.2" fill="none" opacity="0.7" />
      <circle cx={x} cy={y} r="3" fill="var(--accent)" />
    </svg>
  )
}
