import { useEffect, useState } from 'react'

/**
 * Single decision point for whether decorative motion may run. Everything
 * ambient asks this rather than checking media queries independently, so the
 * answer can never disagree between two components.
 */
export function useAmbientMotion() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const saveData = navigator.connection?.saveData === true

    const update = () => setEnabled(!query.matches && !saveData)
    update()

    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return enabled
}
