import { FileText, RotateCcw } from 'lucide-react'
import { socials } from '../../data/portfolio'

export default function ExitScreen() {
  return (
    <div className="max-w-xl">
      <p className="hud-label mb-2">Thank you for visiting</p>
      <h1 className="font-display mb-1 text-[var(--fs-screen)] uppercase italic leading-[0.92] text-bone">
        Mission <br />
        complete
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">See you soon</p>

      <p className="mb-7 text-fluid-base leading-relaxed text-bone/75">
        That is the whole run. If any of it looks like the kind of engineer your
        team is missing, the line is open.
      </p>

      <div className="flex flex-wrap gap-3">
        <a
          href="/assets/resume.pdf"
          download
          className="tap gap-2 rounded-lg px-5 py-3 font-mono text-[12px] font-bold tracking-[0.12em] text-ink-950"
          style={{ background: 'var(--accent)' }}
        >
          <FileText size={15} aria-hidden /> RESUME
        </a>
        <a
          href={`mailto:${socials.email}`}
          className="tap gap-2 rounded-lg border border-bone/20 bg-ink-950/50 px-5 py-3 font-mono text-[12px] tracking-[0.12em] text-bone"
        >
          GET IN TOUCH
        </a>
        <a
          href="#/start"
          className="tap gap-2 rounded-lg border border-bone/20 bg-ink-950/50 px-5 py-3 font-mono text-[12px] tracking-[0.12em] text-bone"
        >
          <RotateCcw size={15} aria-hidden /> BACK TO START
        </a>
      </div>
    </div>
  )
}
