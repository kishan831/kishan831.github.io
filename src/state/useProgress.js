import { useCallback, useMemo, useState } from 'react'
import { screenIds } from '../data/screens'

export const STORAGE_KEY = 'kj.visited.v1'

const TOTAL_SHIPPED = 67
const TOTAL_STARS = 5

/** Private browsing and blocked site data both throw here, so every access is guarded. */
function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((id) => screenIds.includes(id)))
  } catch {
    return new Set()
  }
}

function save(visited) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]))
  } catch {
    // A viewer with storage disabled still gets a working site, just no memory.
  }
}

export function useProgress() {
  const [visited, setVisited] = useState(load)

  const visit = useCallback((id) => {
    if (!screenIds.includes(id)) return false
    let isNew = false
    setVisited((prev) => {
      if (prev.has(id)) return prev
      isNew = true
      const next = new Set(prev)
      next.add(id)
      save(next)
      return next
    })
    return isNew
  }, [])

  const reset = useCallback(() => {
    setVisited(new Set())
    save(new Set())
  }, [])

  return useMemo(() => {
    const ratio = visited.size / screenIds.length
    return {
      visited,
      visit,
      reset,
      isVisited: (id) => visited.has(id),
      ratio,
      stars: Math.round(ratio * TOTAL_STARS),
      shipped: Math.round(ratio * TOTAL_SHIPPED),
    }
  }, [visited, visit, reset])
}
