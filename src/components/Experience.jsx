import { Divider, Eyebrow, Reveal } from './primitives'
import { experience } from '../data/portfolio'

export default function Experience() {
  return (
    <section id="experience" className="relative z-10 py-[var(--space-section)]">
      <Divider />
      <div className="container-px max-w-4xl pt-[var(--space-section)]">
        <Reveal>
          <Eyebrow>Experience</Eyebrow>
        </Reveal>
        <Reveal>
          <h2 className="mb-14 font-heading text-fluid-2xl font-bold leading-snug text-surface-50">
            Education &amp; Experience
          </h2>
        </Reveal>

        <div className="relative pl-9 sm:pl-10">
          {/* Timeline rail */}
          <div
            aria-hidden
            className="absolute bottom-0 left-[19px] top-1 w-0.5"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,214,138,0.5), rgba(0,214,138,0.05))',
            }}
          />

          {experience.map((item, i) => (
            <Reveal key={item.role + item.date} delay={0.04}>
              <div className="relative flex gap-5 pb-12 last:pb-0">
                <span
                  className={`mt-1 h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 border-mint-500 ${
                    item.current ? 'bg-mint-500 shadow-[0_0_16px_rgba(0,214,138,0.4)]' : 'bg-surface-900'
                  }`}
                  style={{ marginLeft: '-1.6rem', zIndex: 2 }}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-surface-400">{item.date}</span>
                    {item.current && (
                      <span className="rounded border border-mint-500/20 bg-mint-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-mint-400">
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-surface-50">{item.role}</h3>
                  <p className="mb-3 text-sm font-medium text-mint-400/85">{item.org}</p>
                  {item.desc && (
                    <p className="mb-3 text-[13px] leading-relaxed text-surface-300">{item.desc}</p>
                  )}
                  {item.sub && <p className="text-[12px] text-surface-400">{item.sub}</p>}
                  {item.tags && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
