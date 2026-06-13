import { useState } from 'react'
import { Divider, Eyebrow, Reveal, CountUp } from './primitives'
import { stats, coreSkills } from '../data/portfolio'

const THUMBS = [
  { id: 'BsKxrJxeV6E', alt: 'Slot Empire gameplay' },
  { id: 'kF5E60FwK8I', alt: 'AiLO Parkour Odyssey gameplay' },
]

function Avatar() {
  const [err, setErr] = useState(false)
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-1.5 rounded-[1.75rem] bg-gradient-to-br from-mint-500/40 via-mint-500/10 to-ember-500/30 opacity-60 blur-lg"
      />
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10">
        {err ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-700 to-surface-800">
            <span className="text-gradient font-heading text-7xl font-extrabold">KJ</span>
          </div>
        ) : (
          <img
            src="/assets/kishan.jpg"
            alt="Kishan Jaiswal, Unity Game Developer"
            loading="lazy"
            onError={() => setErr(true)}
            className="h-full w-full object-cover object-top"
          />
        )}
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="relative z-10 py-[var(--space-section)]">
      <Divider />
      <div className="container-px pt-[var(--space-section)]">
        <Reveal>
          <Eyebrow>Meet Kishan</Eyebrow>
        </Reveal>

        <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <Reveal>
              <h2 className="mb-5 font-heading text-fluid-2xl font-bold leading-snug text-surface-50">
                I build games that players <span className="text-gradient">remember.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="mb-4 text-fluid-base leading-[1.75] text-surface-300">
                Results-driven Unity Game Developer with <strong className="text-surface-100">5+ years</strong>{' '}
                of professional experience building high-performance 2D/3D games across mobile, PC,
                and WebGL platforms. Specialized in casino slot game development — architected a{' '}
                <strong className="text-surface-100">67+ game slot empire</strong> with real-time
                socket services, in-app updates, and RTP-backed mechanics.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mb-8 text-fluid-base leading-[1.75] text-surface-300">
                Proven expertise in gameplay programming, UI/UX, performance optimization,
                multiplayer systems (Photon Fusion), and scalable architecture patterns. Currently
                expanding into Stack Engine integration and RGS (Remote Gaming Server) systems.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mint-400/80">
                Core Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {coreSkills.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-2">
            <div className="mx-auto max-w-[340px] lg:ml-auto lg:mr-0">
              <Avatar />
              <div className="mt-3 grid grid-cols-2 gap-3">
                {THUMBS.map((t) => (
                  <img
                    key={t.id}
                    src={`https://img.youtube.com/vi/${t.id}/mqdefault.jpg`}
                    alt={t.alt}
                    loading="lazy"
                    className="aspect-video w-full rounded-xl border border-white/[0.06] object-cover"
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="card rounded-2xl p-5 text-center">
                <div
                  className={`mb-0.5 font-heading text-3xl font-extrabold ${
                    s.accent ? 'text-ember-400' : 'text-mint-400'
                  }`}
                >
                  <CountUp to={s.value} />
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-surface-400">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
