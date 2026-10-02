import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_SCREEN_ID, screenIds } from '../data/screens'

/**
 * Routes are `#/<id>`. Any other non-empty hash (an in-page anchor such as
 * the skip link's `#panel-…`) is not a route, so it keeps `current` rather
 * than being read as an unknown screen and sending the visitor to Start.
 */
function readHash(current = DEFAULT_SCREEN_ID) {
  const { hash } = window.location
  if (hash && hash !== '#' && !hash.startsWith('#/')) return current
  const id = hash.replace(/^#\/?/, '')
  return screenIds.includes(id) ? id : DEFAULT_SCREEN_ID
}

/**
 * Screen selection lives in the URL so every screen is linkable, shareable
 * and reachable with the browser back button.
 */
export function useHashRoute() {
  const [screenId, setState] = useState(() => readHash())

  useEffect(() => {
    const onChange = () => setState((current) => readHash(current))
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
