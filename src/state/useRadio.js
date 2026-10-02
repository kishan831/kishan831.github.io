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

/** The toggle itself handles its own presses; it must not count as the "first gesture". */
const isToggle = (target) => target instanceof Element && target.closest('[data-radio-toggle]') !== null

/**
 * Opt-in HUD radio. Off by default. A remembered ON never plays on load —
 * browsers block it and visitors hate it — so it waits for the first
 * pointerdown or keydown anywhere on the page. `playing` is true once the
 * engine has actually been asked to play; until then ON is "pending".
 */
export function useRadio(engine = defaultEngine) {
  const [on, setOn] = useState(load)
  const [playing, setPlaying] = useState(false)
  const onRef = useRef(on)
  const playingRef = useRef(false)
  const engineRef = useRef(engine)
  engineRef.current = engine

  const begin = useCallback(() => {
    playingRef.current = true
    setPlaying(true)
    Promise.resolve(engineRef.current.start()).then((ok) => {
      // Blocked (no activation yet) or no Web Audio: go back to pending.
      if (ok === false && onRef.current) {
        playingRef.current = false
        setPlaying(false)
      }
    }, () => {})
  }, [])

  const toggle = useCallback(() => {
    const next = !onRef.current
    onRef.current = next
    setOn(next)
    save(next)
    if (next) {
      begin()
    } else {
      playingRef.current = false
      setPlaying(false)
      engineRef.current.stop()
    }
  }, [begin])

  // Remembered ON: start on the first real gesture. Capture phase so the
  // engine is running before the same keydown reaches the menu and blips.
  useEffect(() => {
    if (!on || playing) return
    const onGesture = (e) => {
      if (isToggle(e.target)) return
      // Escape is not a user activation, so it could not unlock audio anyway.
      if (e.type === 'keydown' && e.key === 'Escape') return
      if (playingRef.current) return
      begin()
    }
    window.addEventListener('pointerdown', onGesture, true)
    window.addEventListener('keydown', onGesture, true)
    return () => {
      window.removeEventListener('pointerdown', onGesture, true)
      window.removeEventListener('keydown', onGesture, true)
    }
  }, [on, playing, begin])

  useEffect(() => {
    const onVisibility = () => {
      if (!onRef.current || !playingRef.current) return
      if (document.visibilityState === 'hidden') engineRef.current.suspend()
      else engineRef.current.resume()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(
    () => () => {
      if (playingRef.current) engineRef.current.stop()
    },
    [],
  )

  const blip = useCallback((kind) => {
    if (!onRef.current) return
    engineRef.current.blip(kind)
  }, [])

  return useMemo(() => ({ on, playing, toggle, blip }), [on, playing, toggle, blip])
}
