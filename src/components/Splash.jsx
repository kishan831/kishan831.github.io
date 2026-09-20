import { AnimatePresence, motion } from 'motion/react'

export default function Splash({ done }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-ink-950"
        >
          <p className="wordmark text-center">
            Kishan
            <br />
            Jaiswal
          </p>
          <span className="h-[3px] w-40 overflow-hidden rounded-full bg-bone/15">
            <span className="block h-full w-1/3 animate-[fxSweep_1.4s_ease-in-out_infinite] rounded-full bg-[var(--accent)]" />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
