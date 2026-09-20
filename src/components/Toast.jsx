import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export default function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return undefined
    const id = setTimeout(onDone, 2400)
    return () => clearTimeout(id)
  }, [message, onDone])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute left-1/2 top-[15%] z-40 -translate-x-1/2"
        >
          <p className="font-display whitespace-nowrap text-[clamp(1.1rem,0.9rem+1.2vw,2rem)] uppercase italic tracking-wide text-[var(--accent)] drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)]">
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
