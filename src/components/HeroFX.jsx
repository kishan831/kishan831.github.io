import { useEffect, useRef } from 'react'

// Lightweight, GPU-cheap floating casino elements (pure CSS transforms — no WebGL).
// Each disc: an outer node that translates for parallax + an inner node that runs
// the float/spin keyframes (separated so the two transforms don't fight).
const DISCS = [
  { kind: 'coin', top: '16%', left: '7%', size: 72, depth: 24, delay: 0 },
  { kind: 'chip', top: '24%', left: '82%', size: 88, depth: 32, delay: 1.2 },
  { kind: 'coin', top: '64%', left: '78%', size: 56, depth: 18, delay: 0.6, blur: true },
  { kind: 'chip', top: '72%', left: '12%', size: 60, depth: 28, delay: 1.8 },
  { kind: 'coin', top: '12%', left: '58%', size: 46, depth: 14, delay: 0.9, blur: true },
  { kind: 'chip', top: '82%', left: '50%', size: 50, depth: 20, delay: 2.2, blur: true },
  { kind: 'coin', top: '46%', left: '90%', size: 40, depth: 12, delay: 1.5, blur: true },
]

export default function HeroFX() {
  const ref = useRef(null)

  // Cheap mouse parallax via CSS variables (rAF-throttled, fine-pointer only)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return

    let frame = 0
    const onMove = (e) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const px = (e.clientX / window.innerWidth - 0.5) * 2
        const py = (e.clientY / window.innerHeight - 0.5) * 2
        el.style.setProperty('--px', px.toFixed(3))
        el.style.setProperty('--py', py.toFixed(3))
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Pause the float animations when the hero scrolls out of view (saves battery)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle('is-paused', !entry.isIntersecting),
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="hero-fx" aria-hidden>
      {DISCS.map((d, i) => (
        <span
          key={i}
          className="fx-disc"
          style={{ top: d.top, left: d.left, '--depth': d.depth }}
        >
          <span
            className={`fx-inner fx-${d.kind}${d.blur ? ' fx-blur' : ''}`}
            style={{ '--size': `${d.size}px`, animationDelay: `${d.delay}s` }}
          />
        </span>
      ))}
    </div>
  )
}
