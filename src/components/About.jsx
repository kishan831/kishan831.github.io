import { Divider, Eyebrow, Reveal, CountUp } from './primitives'
import { stats, coreSkills } from '../data/portfolio'

const COLLAGE = ['RubElttzOaU', 'BsKxrJxeV6E', 'kF5E60FwK8I']

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
                I'm a professional Unity &amp; Casino Game Developer passionate about immersive
                interactive experiences. From architecting slot machine logic with provably fair
                RNG systems to building real-time multiplayer combat using Photon Fusion — I've
                spent the last five years turning ideas into shipped products.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mb-8 text-fluid-base leading-[1.75] text-surface-300">
                I've led a team of 15+ developers, shipped 50+ projects across mobile, PC, and
                WebGL, and built an entire casino platform with 67+ games featuring real-time
                socket-based balance updates, Addressables-driven asset delivery, and in-app
                update systems. Currently expanding into Stack Engine integration and RGS (Remote
                Gaming Server) systems.
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
            <div className="mx-auto grid max-w-[380px] grid-cols-2 grid-rows-2 gap-2 lg:ml-auto lg:mr-0">
              <img
                src={`https://img.youtube.com/vi/${COLLAGE[0]}/maxresdefault.jpg`}
                alt="Zombie Slot Game"
                loading="lazy"
                className="row-span-2 h-full w-full rounded-2xl border border-white/[0.06] object-cover"
              />
              <img
                src={`https://img.youtube.com/vi/${COLLAGE[1]}/maxresdefault.jpg`}
                alt="Vegas Empire slot"
                loading="lazy"
                className="h-full w-full rounded-xl border border-white/[0.06] object-cover"
              />
              <img
                src={`https://img.youtube.com/vi/${COLLAGE[2]}/maxresdefault.jpg`}
                alt="Parkour game"
                loading="lazy"
                className="h-full w-full rounded-xl border border-white/[0.06] object-cover"
              />
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
