import { Divider, Eyebrow, Reveal } from './primitives'
import { skillGroups } from '../data/portfolio'

export default function Skills() {
  return (
    <section id="skills" className="relative z-10 py-[var(--space-section)]">
      <Divider />
      <div className="container-px pt-[var(--space-section)]">
        <Reveal>
          <Eyebrow>Tech Stack</Eyebrow>
        </Reveal>
        <Reveal>
          <h2 className="mb-12 font-heading text-fluid-2xl font-bold leading-snug text-surface-50">
            Tools &amp; Technologies
          </h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map(({ Icon, title, tags, accent }, i) => (
            <Reveal key={title} delay={(i % 3) * 0.08}>
              <div className="card h-full rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      accent ? 'bg-ember-500/10' : 'bg-mint-500/10'
                    }`}
                  >
                    <Icon
                      size={20}
                      className={accent ? 'text-ember-400' : 'text-mint-400'}
                      aria-hidden
                    />
                  </div>
                  <h3 className="font-heading text-[15px] font-semibold text-surface-50">
                    {title}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
