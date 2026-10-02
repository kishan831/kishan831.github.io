import { skillGroups } from '../../data/portfolio'

export default function AcademyScreen() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display mb-1 text-[var(--fs-screen)] uppercase italic leading-none text-bone">
        Academy
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">Loadout</p>

      <p className="mb-6 text-sm leading-relaxed text-bone/70">
        Five years of production work, distilled. These are the tools I reach
        for and the patterns I lean on — the things I would teach someone
        starting out.
      </p>

      <div className="space-y-4">
        {skillGroups.map(({ Icon, title, tags }) => (
          <section key={title}>
            <h2 className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent-hi)]">
              <Icon size={14} aria-hidden />
              {title}
            </h2>
            <ul className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <li
                  key={t}
                  className="rounded border border-bone/10 bg-ink-950/50 px-2 py-1 font-mono text-[10px] text-bone/75"
                >
                  {t}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
