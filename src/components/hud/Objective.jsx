export default function Objective({ objective }) {
  return (
    <div className="min-w-0">
      <p className="hud-label">Current objective</p>
      <p className="font-display max-w-[22ch] text-[clamp(0.9rem,0.8rem+0.5vw,1.25rem)] uppercase leading-[1.1] tracking-wide text-bone">
        {objective}
      </p>
    </div>
  )
}
