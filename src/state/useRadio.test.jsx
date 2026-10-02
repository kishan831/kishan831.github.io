import { describe, it, expect, vi } from 'vitest'
import { act } from 'react'
import { renderHook, fireEvent } from '@testing-library/react'
import { useRadio, RADIO_KEY } from './useRadio'

function fakeEngine() {
  return {
    start: vi.fn(async () => true),
    stop: vi.fn(),
    blip: vi.fn(),
    suspend: vi.fn(),
    resume: vi.fn(),
  }
}

function setVisibility(state) {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state })
  document.dispatchEvent(new Event('visibilitychange'))
}

describe('useRadio', () => {
  it('is off on a first visit and starts nothing on mount', () => {
    const engine = fakeEngine()
    const { result } = renderHook(() => useRadio(engine))
    expect(result.current.on).toBe(false)
    expect(engine.start).not.toHaveBeenCalled()
  })

  it('toggle turns the radio on and off and persists the choice', async () => {
    const engine = fakeEngine()
    const { result } = renderHook(() => useRadio(engine))

    await act(async () => result.current.toggle())
    expect(result.current.on).toBe(true)
    expect(engine.start).toHaveBeenCalledTimes(1)
    expect(window.localStorage.getItem(RADIO_KEY)).toBe('on')

    await act(async () => result.current.toggle())
    expect(result.current.on).toBe(false)
    expect(engine.stop).toHaveBeenCalledTimes(1)
    expect(window.localStorage.getItem(RADIO_KEY)).toBe('off')
  })

  it('stays off on mount when stored off', () => {
    window.localStorage.setItem(RADIO_KEY, 'off')
    const { result } = renderHook(() => useRadio(fakeEngine()))
    expect(result.current.on).toBe(false)
  })

  it('remembers ON but waits for the first pointerdown before starting', async () => {
    window.localStorage.setItem(RADIO_KEY, 'on')
    const engine = fakeEngine()
    const { result } = renderHook(() => useRadio(engine))
    expect(result.current.on).toBe(true)
    expect(result.current.playing).toBe(false)
    expect(engine.start).not.toHaveBeenCalled()

    await act(async () => fireEvent.pointerDown(document.body))
    expect(engine.start).toHaveBeenCalledTimes(1)
    expect(result.current.playing).toBe(true)

    await act(async () => fireEvent.pointerDown(document.body))
    expect(engine.start).toHaveBeenCalledTimes(1)
  })

  it('remembers ON and starts on the first keydown', async () => {
    window.localStorage.setItem(RADIO_KEY, 'on')
    const engine = fakeEngine()
    renderHook(() => useRadio(engine))
    await act(async () => fireEvent.keyDown(window, { key: 'ArrowDown' }))
    expect(engine.start).toHaveBeenCalledTimes(1)
  })

  it('does not treat Escape as the starting gesture (browsers do not count it as activation)', async () => {
    window.localStorage.setItem(RADIO_KEY, 'on')
    const engine = fakeEngine()
    renderHook(() => useRadio(engine))
    await act(async () => fireEvent.keyDown(window, { key: 'Escape' }))
    expect(engine.start).not.toHaveBeenCalled()
  })

  it('keeps waiting for a gesture if the engine could not start', async () => {
    window.localStorage.setItem(RADIO_KEY, 'on')
    const engine = fakeEngine()
    engine.start.mockResolvedValueOnce(false)
    const { result } = renderHook(() => useRadio(engine))
    await act(async () => fireEvent.pointerDown(document.body))
    expect(result.current.playing).toBe(false)
    await act(async () => fireEvent.pointerDown(document.body))
    expect(engine.start).toHaveBeenCalledTimes(2)
    expect(result.current.playing).toBe(true)
  })

  it('blips only while on, with the given kind', async () => {
    const engine = fakeEngine()
    const { result } = renderHook(() => useRadio(engine))
    act(() => result.current.blip('select'))
    expect(engine.blip).not.toHaveBeenCalled()

    await act(async () => result.current.toggle())
    act(() => result.current.blip('move'))
    act(() => result.current.blip('select'))
    expect(engine.blip.mock.calls).toEqual([['move'], ['select']])

    await act(async () => result.current.toggle())
    act(() => result.current.blip('move'))
    expect(engine.blip).toHaveBeenCalledTimes(2)
  })

  it('keeps blip identity stable across toggles', async () => {
    const { result } = renderHook(() => useRadio(fakeEngine()))
    const first = result.current.blip
    await act(async () => result.current.toggle())
    expect(result.current.blip).toBe(first)
  })

  it('suspends when the page is hidden and resumes on return while on', async () => {
    const engine = fakeEngine()
    const { result } = renderHook(() => useRadio(engine))
    await act(async () => result.current.toggle())

    act(() => setVisibility('hidden'))
    expect(engine.suspend).toHaveBeenCalledTimes(1)
    act(() => setVisibility('visible'))
    expect(engine.resume).toHaveBeenCalledTimes(1)
  })

  it('does not touch the engine on visibility changes while off', () => {
    const engine = fakeEngine()
    renderHook(() => useRadio(engine))
    act(() => setVisibility('hidden'))
    act(() => setVisibility('visible'))
    expect(engine.suspend).not.toHaveBeenCalled()
    expect(engine.resume).not.toHaveBeenCalled()
  })

  it('still works when storage throws', async () => {
    const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    try {
      const engine = fakeEngine()
      const { result } = renderHook(() => useRadio(engine))
      expect(result.current.on).toBe(false)
      await act(async () => result.current.toggle())
      expect(result.current.on).toBe(true)
    } finally {
      get.mockRestore()
      set.mockRestore()
    }
  })

  it('stops the engine on unmount', async () => {
    const engine = fakeEngine()
    const { result, unmount } = renderHook(() => useRadio(engine))
    await act(async () => result.current.toggle())
    unmount()
    expect(engine.stop).toHaveBeenCalled()
  })
})
