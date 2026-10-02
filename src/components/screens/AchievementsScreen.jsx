import { Trophy } from 'lucide-react'
import { achievements } from '../../data/portfolio'

export default function AchievementsScreen() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display mb-1 text-[length:var(--fs-screen)] uppercase italic leading-none text-bone">
        Achievements
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">Unlocked</p>

      <ul className="space-y-2">
        {achievements.map((a) => (
          <li
            key={a.title}
            className="flex items-start gap-3 rounded-lg border border-bone/10 bg-ink-950/55 px-3.5 py-3"
          >
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
              style={{ background: 'var(--accent-soft)' }}
            >
              <Trophy size={14} className="text-[var(--accent)]" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-bone">{a.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-bone/60">{a.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
