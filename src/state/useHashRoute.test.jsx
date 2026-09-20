import { describe, it, expect } from 'vitest'
import { act } from 'react'
import { renderHook } from '@testing-library/react'
import { useHashRoute } from './useHashRoute'

describe('useHashRoute', () => {
  it('defaults to the start screen when the hash is empty', () => {
    const { result } = renderHook(() => useHashRoute())
    expect(result.current[0]).toBe('start')
  })

  it('reads a valid hash', () => {
    window.location.hash = '#/skills'
    const { result } = renderHook(() => useHashRoute())
    expect(result.current[0]).toBe('skills')
  })

  it('falls back to the start screen for an unknown hash', () => {
    window.location.hash = '#/nonsense'
    const { result } = renderHook(() => useHashRoute())
    expect(result.current[0]).toBe('start')
  })

  it('writes the hash when the screen is set', () => {
    const { result } = renderHook(() => useHashRoute())
    act(() => result.current[1]('contact'))
    expect(window.location.hash).toBe('#/contact')
    expect(result.current[0]).toBe('contact')
  })

  it('responds to browser navigation', () => {
    const { result } = renderHook(() => useHashRoute())
    act(() => {
      window.location.hash = '#/experience'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(result.current[0]).toBe('experience')
  })
})
