import { useState } from 'react'
import { Play, Lock, ExternalLink } from 'lucide-react'
import { Github } from '../BrandIcons'
import { projects, webProjects, caseStudies } from '../../data/portfolio'
import CaseStudyModal from '../CaseStudyModal'

function Strand({ title, count, children }) {
  return (
    <section className="mb-7">
      <div className="mb-3 flex items-baseline gap-3">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent-hi)]">
          {title}
        </h2>
        <span className="h-px flex-1 bg-bone/15" />
        <span className="font-mono text-[10px] text-bone/60">{count}</span>
      </div>
      <ul className="space-y-1.5">{children}</ul>
    </section>
  )
}

function Row({ children }) {
  return (
    <li className="rounded-lg border border-bone/10 bg-ink-950/55 px-3.5 py-2.5 transition-colors hover:border-[var(--accent)]/40">
      {children}
    </li>
  )
}

export default function ProjectsScreen() {
  const [openCaseId, setOpenCaseId] = useState(null)
  const study = openCaseId ? caseStudies[openCaseId] : null

  return (
    <div className="max-w-xl">
      <h1 className="font-display mb-1 text-[length:var(--fs-screen)] uppercase italic leading-none text-bone">
        Projects
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">Missions</p>

      <Strand title="Casino Ops" count={`${projects.length} missions`}>
        {projects.map((p) => (
          <Row key={p.title}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-[var(--accent)]">
                {p.type === 'github' ? <Github size={14} /> : <Play size={14} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-bone">{p.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-bone/60">{p.desc}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {p.vid && (
                    <a
                      href={`https://www.youtube.com/watch?v=${p.vid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tap inline-flex items-center font-mono text-[10px] tracking-[0.14em] text-[var(--accent-hi)] underline underline-offset-4"
                    >
                      WATCH
                    </a>
                  )}
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tap inline-flex items-center font-mono text-[10px] tracking-[0.14em] text-[var(--accent-hi)] underline underline-offset-4"
                    >
                      CODE
                    </a>
                  )}
                  {p.caseId && (
                    <button
                      type="button"
                      onClick={() => setOpenCaseId(p.caseId)}
                      className="tap inline-flex items-center font-mono text-[10px] tracking-[0.14em] text-bone/70 underline underline-offset-4 hover:text-bone"
                    >
                      CASE FILE
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Row>
        ))}
      </Strand>

      <Strand title="Web Ops" count={`${webProjects.length} missions`}>
        {webProjects.map((w) =>
          w.status === 'locked' ? (
            <li
              key={w.title}
              data-testid="mission-locked"
              className="rounded-lg border border-dashed border-bone/15 bg-ink-950/40 px-3.5 py-2.5"
            >
              <div className="flex items-start gap-3">
                <Lock size={14} className="mt-0.5 shrink-0 text-bone/35" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-bone/60">{w.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-bone/60">{w.desc}</p>
                  <p className="mt-1.5 font-mono text-[10px] tracking-[0.16em] text-bone/65">
                    IN DEVELOPMENT · {w.stack.join(' · ')}
                  </p>
                </div>
              </div>
            </li>
          ) : (
            <Row key={w.title}>
              <div className="flex items-start gap-3">
                <ExternalLink size={14} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-bone">{w.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-bone/60">{w.desc}</p>
                  <a
                    href={w.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap mt-1 inline-flex items-center font-mono text-[10px] tracking-[0.14em] text-[var(--accent-hi)] underline underline-offset-4"
                  >
                    CODE
                  </a>
                </div>
              </div>
            </Row>
          ),
        )}
      </Strand>

      <CaseStudyModal study={study} onClose={() => setOpenCaseId(null)} />
    </div>
  )
}
