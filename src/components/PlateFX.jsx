/**
 * Ambient layer over a plate: drift, grain, light sweep, neon pulse.
 * Pure CSS — the classes are defined in index.css so nothing animates in JS.
 */
export default function PlateFX({ enabled }) {
  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
      <div className="fx-grain absolute inset-0" />
      <div className="fx-sweep absolute inset-0" />
      <div className="fx-neon absolute inset-0" />
    </div>
  )
}
