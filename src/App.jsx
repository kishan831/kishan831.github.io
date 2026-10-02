import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { DEFAULT_SCREEN_ID, getScreen, screenIds } from './data/screens'
import { useHashRoute } from './state/useHashRoute'
import { useProgress } from './state/useProgress'
import { useAmbientMotion } from './state/useAmbientMotion'
import Menu from './components/menu/Menu'
import Hud from './components/hud/Hud'
import Plate from './components/Plate'
import PlateFX from './components/PlateFX'
import Sprites from './components/Sprites'
import Toast from './components/Toast'
import Splash from './components/Splash'
import ScreenBody from './components/screens/ScreenBody'
import PlainView from './components/PlainView'

export default function App() {
  const [screenId, setScreenId] = useHashRoute()
  const { visit, isVisited, stars, shipped, ratio } = useProgress()
  const ambient = useAmbientMotion()
  const [toast, setToast] = useState('')
  const [ready, setReady] = useState(false)
  const [plain, setPlain] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const panelRef = useRef(null)

  const screen = getScreen(screenId) ?? getScreen(DEFAULT_SCREEN_ID)

  // The document carries the active screen so CSS, not JavaScript, retints.
  useEffect(() => {
    document.documentElement.setAttribute('data-screen', screen.id)
  }, [screen.id])

  useEffect(() => {
    if (visit(screen.id)) setToast('Mission passed')
  }, [screen.id, visit])

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 350)
    return () => clearTimeout(id)
  }, [])

  // Focus the panel heading on change so keyboard and screen-reader users
  // land on the new content rather than staying in the menu.
  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true })
  }, [screen.id])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape' || plain) return
      // The sheet is an overlay: Escape dismisses it before anything else.
      if (menuOpen) setMenuOpen(false)
      else setScreenId(DEFAULT_SCREEN_ID)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setScreenId, plain, menuOpen])

  // Horizontal swipe moves between screens on touch devices.
  useEffect(() => {
    let startX = 0
    let startY = 0

    const onStart = (e) => {
      startX = e.changedTouches[0].clientX
      startY = e.changedTouches[0].clientY
    }

    const onEnd = (e) => {
      if (menuOpen) return
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return
      const i = screenIds.indexOf(screen.id)
      const next = dx < 0 ? i + 1 : i - 1
      if (next >= 0 && next < screenIds.length) setScreenId(screenIds[next])
    }

    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [screen.id, setScreenId, menuOpen])

  const clearToast = useCallback(() => setToast(''), [])

  if (plain) return <PlainView onClose={() => setPlain(false)} />

  return (
    <>
      <a href={`#panel-${screen.id}`} className="skip-link">
        Skip to content
      </a>

      <Splash done={ready} />

      <main
        id="main"
        className="relative h-[100svh] w-full overflow-hidden bg-ink-950"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={screen.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: ambient ? 0.42 : 0, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <div className={ambient ? 'fx-drift absolute inset-0' : 'absolute inset-0'}>
              <Plate
                plate={screen.plate}
                alt=""
                accent={screen.accent}
                priority={screen.id === DEFAULT_SCREEN_ID}
              />
            </div>
            <PlateFX enabled={ambient} />
            <Sprites screenId={screen.id} enabled={ambient} />
          </motion.div>
        </AnimatePresence>

        <div className="scrim-left pointer-events-none absolute inset-y-0 left-0 z-20 w-full sm:w-2/3 lg:w-1/2" />

        <div className="absolute inset-0 z-20 flex flex-col">
          <div className="flex min-h-0 flex-1 flex-col gap-4 px-[var(--gutter)] pb-28 pt-[6.75rem] lg:pt-20 lg:flex-row lg:gap-10">
            <div className="hidden w-full shrink-0 lg:block lg:w-[min(30vw,22rem)]">
              <p className="wordmark mb-1">
                Kishan
                <br />
                Jaiswal
              </p>
              <p className="script-sub mb-5 -mt-1 pl-1 text-[clamp(1.1rem,0.9rem+1vw,1.9rem)]">
                Portfolio
              </p>
              <Menu activeId={screen.id} isVisited={isVisited} onSelect={setScreenId} />
              <button
                type="button"
                onClick={() => setPlain(true)}
                className="tap mt-4 w-full justify-start px-3 font-mono text-[11px] tracking-[0.16em] text-bone/55 underline decoration-dotted underline-offset-4 hover:text-bone"
              >
                PLAIN RÉSUMÉ VIEW
              </button>
            </div>

            <div className="absolute left-[var(--gutter)] top-[calc(var(--hud-pad)+2.5rem)] z-30 flex gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="tap gap-2 rounded-lg border border-bone/20 bg-ink-950/70 px-3.5 py-2 font-mono text-[11px] tracking-[0.16em] text-bone"
              >
                MENU
              </button>
              <button
                type="button"
                onClick={() => setPlain(true)}
                className="tap rounded-lg border border-bone/20 bg-ink-950/70 px-3 py-2 font-mono text-[11px] tracking-[0.16em] text-bone/70"
              >
                PLAIN
              </button>
            </div>

            <div
              id={`panel-${screen.id}`}
              ref={panelRef}
              role="tabpanel"
              tabIndex={-1}
              aria-labelledby={`tab-${screen.id}`}
              className="min-h-0 flex-1 overflow-y-auto pb-4 outline-none"
            >
              <ScreenBody screenId={screen.id} />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: ambient ? 0.3 : 0, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-x-0 bottom-0 z-40 max-h-[80svh] overflow-y-auto rounded-t-2xl border-t border-bone/15 bg-ink-950/97 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
            >
              <Menu
                activeId={screen.id}
                isVisited={isVisited}
                onSelect={(id) => {
                  setScreenId(id)
                  setMenuOpen(false)
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  setPlain(true)
                }}
                className="tap mt-3 w-full rounded-lg border border-bone/20 font-mono text-[11px] tracking-[0.16em] text-bone/70"
              >
                PLAIN RÉSUMÉ VIEW
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="tap mt-2 w-full rounded-lg border border-bone/20 font-mono text-[11px] tracking-[0.16em] text-bone"
              >
                CLOSE
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <Hud objective={screen.objective} stars={stars} shipped={shipped} ratio={ratio} />
        <Toast message={toast} onDone={clearToast} />

        <p aria-live="polite" className="sr-only">
          {screen.label} screen
        </p>
      </main>
    </>
  )
}
