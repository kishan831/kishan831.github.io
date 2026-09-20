import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_SCREEN_ID, screenIds } from '../data/screens'

function readHash() {
  const id = window.location.hash.replace(/^#\/?/, '')
  return screenIds.includes(id) ? id : DEFAULT_SCREEN_ID
}

/**
 * Screen selection lives in the URL so every screen is linkable, shareable
 * and reachable with the browser back button.
 */
export function useHashRoute() {
  const [screenId, setState] = useState(readHash)

  useEffect(() => {
    const onChange = () => setState(readHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const setScreenId = useCallback((id) => {
    if (!screenIds.includes(id)) return
    window.location.hash = `#/${id}`
    setState(id)
  }, [])

  return [screenId, setScreenId]
}
