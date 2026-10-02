import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { X, ExternalLink, Play, Check } from 'lucide-react'
import { Github } from './BrandIcons'

export default function CaseStudyModal({ study, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!study) return
    // preventDefault marks the key as handled, so the app-level Escape (which
    // jumps to Start) leaves it alone: with a dialog open, Escape only closes it.
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    // focus the close button when the dialog opens
    const t = setTimeout(() => closeRef.current?.focus(), 30)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      clearTimeout(t)
    }
  }, [study, onClose])

  // Portalled to <body>: the screen layer is its own stacking context below the
  // HUD, so rendering in place let the HUD paint over the dialog.
  return createPortal(
    <AnimatePresence>
      {study && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            data-testid="case-study-backdrop"
            className="absolute inset-0 bg-ink-950/90 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cs-title"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-bone/15 bg-ink-900 p-6 shadow-[0_24px_80px_rgb(0_0_0/0.6)] sm:rounded-3xl sm:p-8"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close case study"
              className="tap absolute right-2 top-2 rounded-full text-bone/70 transition hover:text-[var(--accent-hi)]"
            >
              <X size={22} />
            </button>

            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--accent-hi)]">
              {study.badge}
            </span>
            <h3
              id="cs-title"
              className="mb-4 mt-1 pr-10 font-display text-[clamp(1.5rem,1.2rem+1.4vw,2.25rem)] uppercase leading-tight text-bone"
            >
              {study.title}
            </h3>

            {study.vid && (
              <div className="mb-6 aspect-video overflow-hidden rounded-xl border border-bone/10">
                <img
                  src={`https://img.youtube.com/vi/${study.vid}/maxresdefault.jpg`}
                  alt={`${study.title} preview`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <p className="mb-6 text-fluid-base leading-relaxed text-bone/80">{study.overview}</p>

            <Block label="My Role">
              <p className="text-sm leading-relaxed text-bone/80">{study.role}</p>
            </Block>

            <Block label="What I Built">
              <ul className="space-y-2">
                {study.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5 text-sm leading-relaxed text-bone/80">
                    <Check size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" aria-hidden />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </Block>

            <Block label="Tech">
              <div className="flex flex-wrap gap-1.5">
                {study.tech.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </Block>

            <Block label="Outcome">
              <p className="text-sm leading-relaxed text-bone/80">{study.outcome}</p>
            </Block>

            {study.links?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {study.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-ink-950 transition hover:bg-[var(--accent-hi)]"
                  >
                    {l.type === 'github' ? <Github size={16} /> : l.type === 'video' ? <Play size={16} /> : <ExternalLink size={16} />}
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function Block({ label, children }) {
  return (
    <div className="mb-5 border-t border-bone/10 pt-5">
      <h4 className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-[var(--accent-hi)]">
        {label}
      </h4>
      {children}
    </div>
  )
}
