import {
  stats, capabilities, experience, projects, webProjects, achievements, socials,
} from '../data/portfolio'

function Section({ title, children }) {
  return (
    <section className="mt-9">
      <h2 className="mb-3 border-b border-bone/15 pb-1.5 font-display text-2xl uppercase tracking-wide text-bone">
        {title}
      </h2>
      {children}
    </section>
  )
}

/**
 * The same content as the nine screens, as one conventional document.
 *
 * This is not a fallback — it is the surface a recruiter with ten seconds
 * uses, and the one that prints. The game interface is the other way in.
 */
export default function PlainView({ onClose }) {
  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <button
        type="button"
        onClick={onClose}
        className="tap mb-8 justify-start font-mono text-[11px] tracking-[0.16em] text-bone/60 underline decoration-dotted underline-offset-4 hover:text-bone"
      >
        ← BACK TO THE MENU
      </button>

      <h1 className="font-display text-4xl uppercase leading-none text-bone">Kishan Jaiswal</h1>
      <p className="mt-2 text-sm text-bone/70">
        Real-time systems engineer — Unity, C#, React, Node. India, working remotely.
      </p>
      <p className="mt-1 text-sm text-bone/70">
        <a className="underline underline-offset-4" href={`mailto:${socials.email}`}>{socials.email}</a>
        {' · '}
        <a className="underline underline-offset-4" href={socials.github}>GitHub</a>
        {' · '}
        <a className="underline underline-offset-4" href={socials.linkedin}>LinkedIn</a>
        {' · '}
        <a className="underline underline-offset-4" href="/assets/resume.pdf" download>Résumé (PDF)</a>
      </p>

      <Section title="About">
        <p className="text-sm leading-relaxed text-bone/80">
          I build the systems players never see — mechanics, state
          synchronisation, and the delivery pipelines that let 67 games live on
          one platform. Five years in production, from leading a team of 15
          across 50+ projects to architecting slot games from scratch.
        </p>
        <ul aria-label="Headline numbers" className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-bone/70">
          {stats.map((s) => (
            <li key={s.label}>
              <strong className="text-bone">{s.value}{s.suffix}</strong> {s.label}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Skills">
        <ul className="space-y-1 text-sm text-bone/80">
          {capabilities.map((c) => (
            <li key={c.label}>
              <strong className="text-bone">{c.label}</strong> — {c.unit}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Projects">
        <ul className="space-y-2.5 text-sm">
          {[...projects, ...webProjects].map((p) => (
            <li key={p.title}>
              <p className="font-semibold text-bone">
                {p.title}
                {p.status === 'locked' && (
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-wide text-bone/60">
                    In development
                  </span>
                )}
              </p>
              <p className="text-bone/70">{p.desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Experience">
        <ul className="space-y-3 text-sm">
          {experience.map((e) => (
            <li key={`${e.date}-${e.role}`}>
              <p className="font-mono text-[11px] tracking-wide text-bone/60">{e.date}</p>
              <p className="font-semibold text-bone">{e.role}</p>
              <p className="text-bone/70">{e.org}</p>
              {e.desc && <p className="mt-1 text-bone/70">{e.desc}</p>}
              {e.sub && <p className="mt-1 text-bone/70">{e.sub}</p>}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Achievements">
        <ul className="space-y-1.5 text-sm">
          {achievements.map((a) => (
            <li key={a.title}>
              <strong className="text-bone">{a.title}</strong>
              <span className="text-bone/70"> — {a.desc}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Contact">
        <p className="text-sm text-bone/80">
          Email <a className="underline underline-offset-4" href={`mailto:${socials.email}`}>{socials.email}</a>,
          or reach me on <a className="underline underline-offset-4" href={socials.linkedin}>LinkedIn</a>.
        </p>
      </Section>
    </main>
  )
}
