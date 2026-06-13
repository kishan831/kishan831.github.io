import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView } from 'framer-motion'

/** Thin gradient divider that opens each section */
export function Divider() {
  return (
    <div
      aria-hidden
      className="h-px w-full"
      style={{
        background:
          'linear-gradient(90deg, transparent 0%, rgba(0,214,138,0.15) 50%, transparent 100%)',
      }}
    />
  )
}

/** Monospace section label with a trailing rule */
export function Eyebrow({ children }) {
  return (
    <div className="mb-12 flex items-center gap-3">
      <span className="font-mono text-[11px] uppercase tracking-widest text-mint-500">
        {children}
      </span>
      <div className="h-px flex-1 bg-surface-500/20" />
    </div>
  )
}

/** Fade-up on scroll into view (respects reduced-motion via CSS override) */
export function Reveal({ children, className, delay = 0, as = 'div' }) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}

/** Animated number that counts up the first time it scrolls into view */
export function CountUp({ to, suffix = '+' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.6,
      ease: 'easeOut',
      onUpdate: (v) => setVal(Math.ceil(v)),
    })
    return () => controls.stop()
  }, [inView, to])

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  )
}
