import { describe, it, expect, vi } from 'vitest'
import { act } from 'react'
import { renderHook } from '@testing-library/react'
import { useProgress, STORAGE_KEY } from './useProgress'

describe('useProgress', () => {
  it('starts with nothing visited', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.visited.size).toBe(0)
    expect(result.current.stars).toBe(0)
    expect(result.current.shipped).toBe(0)
  })

  it('reports a first visit as new and a repeat visit as not new', () => {
    const { result } = renderHook(() => useProgress())
    let first, second
    act(() => { first = result.current.visit('about') })
    act(() => { second = result.current.visit('about') })
    expect(first).toBe(true)
    expect(second).toBe(false)
    expect(result.current.visited.size).toBe(1)
  })

  it('awards all five stars and the full count when every screen is visited', () => {
    const { result } = renderHook(() => useProgress())
    act(() => {
      for (const id of ['start', 'about', 'skills', 'projects', 'experience',
        'achievements', 'academy', 'contact', 'exit']) result.current.visit(id)
    })
    expect(result.current.stars).toBe(5)
    expect(result.current.shipped).toBe(67)
    expect(result.current.ratio).toBe(1)
  })

  it('persists across mounts', () => {
    const first = renderHook(() => useProgress())
    act(() => { first.result.current.visit('skills') })
    first.unmount()
    const second = renderHook(() => useProgress())
    expect(second.result.current.isVisited('skills')).toBe(true)
  })

  it('survives storage being unavailable', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    const { result } = renderHook(() => useProgress())
    expect(result.current.visited.size).toBe(0)
    spy.mockRestore()
  })

  it('ignores junk in storage', () => {
    window.localStorage.setItem(STORAGE_KEY, 'not json')
    const { result } = renderHook(() => useProgress())
    expect(result.current.visited.size).toBe(0)
  })
})
