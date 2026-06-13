import { lazy, Suspense } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, FileText } from 'lucide-react'

// Lazy-loaded so the heavy 3D libs never block first paint
const HeroScene = lazy(() => import('./HeroScene'))

const fade = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* Soft ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 z-0 h-[500px] w-[700px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint-500/[0.05] blur-[140px]"
      />

      {/* Interactive casino-themed 3D scene (skipped for reduced-motion users) */}
      {!reduceMotion && (
        <div aria-hidden className="absolute inset-0 z-0 opacity-90">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>
      )}

      <div className="container-px relative z-10 pb-20 pt-28 sm:pb-0 sm:pt-0">
        <div className="max-w-3xl">
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            custom={0}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-mint-500/15 bg-mint-500/[0.07] px-3.5 py-1.5"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mint-500" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-mint-400">
              Open to Opportunities
            </span>
          </motion.div>

          <motion.h1
            variants={fade}
            initial="hidden"
            animate="show"
            custom={1}
            className="mb-5 font-heading text-fluid-hero font-extrabold leading-[1.08] tracking-tight text-surface-50"
          >
            Kishan Jaiswal
          </motion.h1>

          <motion.p
            variants={fade}
            initial="hidden"
            animate="show"
            custom={2}
            className="mb-3 font-heading text-fluid-lg font-medium text-surface-300"
          >
            Unity Game Developer —{' '}
            <span className="text-mint-400">Casino &amp; Slot Games</span>
          </motion.p>

          <motion.p
            variants={fade}
            initial="hidden"
            animate="show"
            custom={3}
            className="mb-9 max-w-xl text-fluid-base leading-relaxed text-surface-400"
          >
            Crafting high-performance casino slot games, multiplayer combat systems, and
            immersive 3D experiences with{' '}
            <strong className="text-surface-200">5+ years</strong> of professional expertise.
            Currently building a 67+ game Slot Empire with Stack Engine &amp; RGS integration.
          </motion.p>

          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            custom={4}
            className="flex flex-wrap items-center gap-3.5"
          >
            <a
              href="#projects"
              className="tap group gap-2 rounded-xl bg-mint-500 px-6 py-3 text-sm font-bold text-surface-900 transition-all duration-300 hover:shadow-[0_0_32px_rgba(0,214,138,0.25)]"
            >
              Explore Projects
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/assets/resume.pdf"
              download
              className="tap card gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-surface-200 hover:text-mint-400"
            >
              <FileText size={16} /> Resume
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
