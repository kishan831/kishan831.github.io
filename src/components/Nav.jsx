import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: highlight the nav link for the section currently in view
  useEffect(() => {
    const ids = [...LINKS.map((l) => l.href.slice(1)), 'contact']
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/5 bg-surface-900/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="container-px flex h-16 items-center justify-between">
        <a href="#hero" className="flex items-center gap-2.5" aria-label="Home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-mint-500/20 bg-mint-500/10 font-heading text-base font-bold text-mint-500">
            K
          </span>
          <span className="hidden font-heading text-sm font-semibold text-surface-50 sm:inline">
            kishan<span className="text-mint-500">.</span>dev
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              aria-current={active === l.href.slice(1) ? 'true' : undefined}
              className={`text-[13px] font-medium transition hover:text-mint-400 ${
                active === l.href.slice(1) ? 'text-mint-400' : 'text-surface-300'
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="tap rounded-full border border-mint-500/25 bg-mint-500/10 px-5 py-2 text-[13px] font-semibold text-mint-400 transition-all duration-300 hover:bg-mint-500 hover:text-surface-900"
          >
            Contact
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="tap text-surface-100 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-surface-900/97 backdrop-blur-2xl md:hidden"
          >
            {[...LINKS, { href: '#contact', label: 'Contact' }].map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-heading text-2xl font-bold text-surface-50 last:text-mint-400"
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
