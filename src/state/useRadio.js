import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { radio as defaultEngine } from '../audio/radio'

export const RADIO_KEY = 'kj-radio'

/** Private browsing and blocked site data both throw here, so every access is guarded. */
function load() {
  try {
    return window.localStorage.getItem(RADIO_KEY) === 'on'
  } catch {
    return false
  }
}

function save(on) {
  try {
    window.localStorage.setItem(RADIO_KEY, on ? 'on' : 'off')
  } catch {
    // Storage disabled: the toggle still works for this visit.
  }
}

/**
 * The toggle handles its own presses, and controls marked `data-radio-skip`
 * (the ways into the plain résumé, which has no radio control) must not
 * start audio either, so neither counts as the "first gesture".
 */
const isExempt = (target) =>
  target instanceof Element && target.closest('[data-radio-toggle], [data-radio-skip]') !== null

/**
 * Only events that grant user activation can unlock audio. Per the HTML
 * spec a pointerdown counts only for a mouse; touch and pen activate on
 * pointerup / touchend. Escape never counts. `click` is a backstop for
 * browsers (older iOS) that unlock on it rather than on touchend.
 */
function isActivation(e) {
  switch (e.type) {
    case 'keydown':
      return e.key !== 'Escape'
    case 'pointerdown':
      return e.pointerType === 'mouse'
    case 'pointerup':
      return e.pointerType !== 'mouse'
    default:
      return true // touchend, click
  }
}

const GESTURES = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']

/**
 * Opt-in HUD radio. Off by default. A remembered ON never plays on load —
 * browsers block it and visitors hate it — so it waits for the first
 * user-activation gesture anywhere on the page. `playing` is true only while
 * the engine reports audio actually running; until then ON is "pending".
 *
 * `muted` silences an ON radio without changing the stored preference (the
 * plain résumé view has no radio control, so nothing may play there).
 */
export function useRadio(engine = defaultEngine, { muted = false } = {}) {
  const [on, setOn] = useState(load)
  const [playing, setPlaying] = useState(false)
  const onRef = useRef(on)
  // The engine has been asked to play (and not stopped since).
  const startedRef = useRef(false)
  const mutedRef = useRef(muted)
  mutedRef.current = muted
  // Only the newest start() may settle `playing`; older results are stale.
  const tokenRef = useRef(0)
  const engineRef = useRef(engine)
  engineRef.current = engine

  const begin = useCallback(() => {
    startedRef.current = true
    const token = ++tokenRef.current
    Promise.resolve(engineRef.current.start()).then(
      (ok) => {
        if (token !== tokenRef.current || !onRef.current) return
        // Blocked (no activation yet) or no Web Audio: stay pending.
        setPlaying(ok !== false)
      },
      () => {},
    )
  }, [])

  const toggle = useCallback(() => {
    const next = !onRef.current
    onRef.current = next
    setOn(next)
    save(next)
    if (next) {
      begin()
    } else {
      startedRef.current = false
      tokenRef.current += 1
      setPlaying(false)
      engineRef.current.stop()
    }
  }, [begin])

  // The engine's own view of the context: a slow resume that lands after
  // start() stopped waiting, or a suspend (hidden tab, OS interruption).
  useEffect(() => {
    const unsubscribe = engineRef.current.subscribe?.((running) => {
      if (onRef.current && startedRef.current) setPlaying(running)
    })
    return () => unsubscribe?.()
  }, [])

  // Remembered ON (or a start the browser blocked): retry on every
  // activation gesture until audio runs. Capture phase so the engine is
  // running before the same keydown reaches the menu and blips.
  useEffect(() => {
    if (!on || playing || muted) return
    const onGesture = (e) => {
      if (isExempt(e.target) || !isActivation(e)) return
      begin()
    }
    for (const type of GESTURES) window.addEventListener(type, onGesture, true)
    return () => {
      for (const type of GESTURES) window.removeEventListener(type, onGesture, true)
    }
  }, [on, playing, muted, begin])

  // Hidden tab or muted: suspend. Visible and unmuted again: resume.
  const syncPause = useCallback(() => {
    if (!onRef.current || !startedRef.current) return
    if (mutedRef.current || document.visibilityState === 'hidden') engineRef.current.suspend()
    else engineRef.current.resume()
  }, [])

  useEffect(() => {
    document.addEventListener('visibilitychange', syncPause)
    return () => document.removeEventListener('visibilitychange', syncPause)
  }, [syncPause])

  // A no-op on mount (nothing has started yet); after that, every change.
  useEffect(() => {
    syncPause()
  }, [muted, syncPause])

  useEffect(
    () => () => {
      if (startedRef.current) engineRef.current.stop()
    },
    [],
  )

  const blip = useCallback((kind) => {
    if (!onRef.current || mutedRef.current) return
    engineRef.current.blip(kind)
  }, [])

  return useMemo(() => ({ on, playing, toggle, blip }), [on, playing, toggle, blip])
}
