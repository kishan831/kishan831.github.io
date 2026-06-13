import { useState } from 'react'
import { Github, Play } from 'lucide-react'
import { Divider, Eyebrow, Reveal } from './primitives'
import { projects } from '../data/portfolio'

function Tags({ tags, extra }) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((t) => (
        <span key={t} className="tag">
          {t}
        </span>
      ))}
      {extra && <span className="tag border-white/[0.06] bg-white/[0.04] text-surface-300">{extra}</span>}
    </div>
  )
}

function VideoCard({ p }) {
  const [playing, setPlaying] = useState(false)
  const thumbId = p.thumb || p.vid

  return (
    <div className="card group overflow-hidden rounded-2xl">
      <div className="relative aspect-video overflow-hidden bg-surface-800">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${p.vid}?autoplay=1&rel=0`}
            title={p.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${p.title}`}
            className="block h-full w-full cursor-pointer"
          >
            <img
              src={`https://img.youtube.com/vi/${thumbId}/maxresdefault.jpg`}
              alt={p.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span
              aria-hidden
              className="absolute inset-0"
              style={{ background: 'linear-gradient(0deg, rgba(7,7,13,0.8) 0%, transparent 55%)' }}
            />
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-mint-500/90 shadow-[0_0_30px_rgba(0,214,138,0.25)] transition-transform duration-300 group-hover:scale-110">
              <Play size={20} className="ml-0.5 fill-surface-900 text-surface-900" />
            </span>
          </button>
        )}
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="font-heading text-[15px] font-semibold text-surface-50 transition group-hover:text-mint-400">
            {p.title}
          </h3>
          <span className="tag border-white/[0.06] bg-white/[0.04] text-[9px] text-surface-300">
            {p.badge}
          </span>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-surface-400">{p.desc}</p>
        <Tags tags={p.tags} extra={p.extra} />
      </div>
    </div>
  )
}

function GithubCard({ p }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card group block overflow-hidden rounded-2xl"
    >
      <div className="flex aspect-video flex-col items-center justify-center gap-3 border-b border-white/[0.05] bg-surface-700/40">
        <Github size={40} className="text-mint-300" strokeWidth={1.5} />
        <span className="font-mono text-[10px] tracking-wider text-mint-400/60">VIEW ON GITHUB</span>
      </div>
      <div className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="font-heading text-[15px] font-semibold text-surface-50 transition group-hover:text-mint-400">
            {p.title}
          </h3>
          <span className="tag border-white/[0.06] bg-white/[0.04] text-[9px] text-surface-300">
            {p.badge}
          </span>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-surface-400">{p.desc}</p>
        <Tags tags={p.tags} extra={p.extra} />
      </div>
    </a>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="relative z-10 py-[var(--space-section)]">
      <Divider />
      <div className="container-px pt-[var(--space-section)]">
        <Reveal>
          <Eyebrow>Featured Work</Eyebrow>
        </Reveal>
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <Reveal>
            <div>
              <h2 className="font-heading text-fluid-2xl font-bold leading-snug text-surface-50">
                Projects I've Built
              </h2>
              <p className="mt-2 text-sm text-surface-400">
                A showcase of casino, slot, and indie games from my professional &amp; personal
                portfolio.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <p className="font-mono text-xs tracking-wide text-surface-500">Click thumbnails to play</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.06}>
              {p.type === 'github' ? <GithubCard p={p} /> : <VideoCard p={p} />}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
