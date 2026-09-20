import { ArrowRight, FileText } from 'lucide-react'
import { stats } from '../../data/portfolio'

export default function StartScreen() {
  return (
    <div className="max-w-xl">
      <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent-hi)]">
          Open to opportunities
        </span>
      </p>

      <h1 className="font-display mb-4 text-[var(--fs-screen)] uppercase italic leading-[0.92] text-bone">
        Real-time systems
        <br />
        engineer
      </h1>

      <p className="mb-7 text-fluid-base leading-relaxed text-bone/75">
        Games people play, and the products behind them. Five years shipping
        production game systems — currently building a 67-game casino platform
        with Stack Engine and RGS integration.
      </p>

      <dl className="mb-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone/50">
              {s.label === 'Casino Games' ? 'Casino games' : s.label}
            </dt>
            <dd className="font-display text-[clamp(1.75rem,1.2rem+2.4vw,3.25rem)] leading-none text-[var(--accent-hi)]">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-3">
        <a
          href="#/projects"
          className="tap gap-2 rounded-lg px-5 py-3 font-mono text-[12px] font-bold tracking-[0.12em] text-ink-950"
          style={{ background: 'var(--accent)' }}
        >
          SEE THE WORK <ArrowRight size={15} />
        </a>
        <a
          href="/assets/resume.pdf"
          download
          className="tap gap-2 rounded-lg border border-bone/20 bg-ink-950/50 px-5 py-3 font-mono text-[12px] tracking-[0.12em] text-bone"
        >
          <FileText size={15} /> RESUME
        </a>
      </div>
    </div>
  )
}
