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

  it('remembers ON but waits for the first (mouse) pointerdown before starting', async () => {
    window.localStorage.setItem(RADIO_KEY, 'on')
    const engine = fakeEngine()
    const { result } = renderHook(() => useRadio(engine))
    expect(result.current.on).toBe(true)
    expect(result.current.playing).toBe(false)
    expect(engine.start).not.toHaveBeenCalled()

    await act(async () => fireEvent.pointerDown(document.body, { pointerType: 'mouse' }))
    expect(engine.start).toHaveBeenCalledTimes(1)
    expect(result.current.playing).toBe(true)

    await act(async () => fireEvent.pointerDown(document.body, { pointerType: 'mouse' }))
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
    await act(async () => fireEvent.pointerDown(document.body, { pointerType: 'mouse' }))
    expect(result.current.playing).toBe(false)
    await act(async () => fireEvent.pointerDown(document.body, { pointerType: 'mouse' }))
    expect(engine.start).toHaveBeenCalledTimes(2)
    expect(result.current.playing).toBe(true)
  })

  it('on touch, a pointerdown is not a user activation; the pointerup of the same tap starts it', async () => {
    window.localStorage.setItem(RADIO_KEY, 'on')
    const engine = fakeEngine()
    const { result } = renderHook(() => useRadio(engine))
    await act(async () => fireEvent.pointerDown(document.body, { pointerType: 'touch' }))
    expect(engine.start).not.toHaveBeenCalled()
    await act(async () => fireEvent.pointerUp(document.body, { pointerType: 'touch' }))
    expect(engine.start).toHaveBeenCalledTimes(1)
    expect(result.current.playing).toBe(true)
  })

  it('starts on touchend and click too (iOS unlocks on those)', async () => {
    window.localStorage.setItem(RADIO_KEY, 'on')
    const engine = fakeEngine()
    const first = renderHook(() => useRadio(engine))
    await act(async () => fireEvent.touchEnd(document.body))
    expect(engine.start).toHaveBeenCalledTimes(1)
    first.unmount()

    const other = fakeEngine()
    renderHook(() => useRadio(other))
    await act(async () => fireEvent.click(document.body))
    expect(other.start).toHaveBeenCalledTimes(1)
  })

  it('ignores a pen pointerdown and a mouse pointerup', async () => {
    window.localStorage.setItem(RADIO_KEY, 'on')
    const engine = fakeEngine()
    renderHook(() => useRadio(engine))
    await act(async () => fireEvent.pointerDown(document.body, { pointerType: 'pen' }))
    await act(async () => fireEvent.pointerUp(document.body, { pointerType: 'mouse' }))
    expect(engine.start).not.toHaveBeenCalled()
  })

  it('retries the unlock on later gestures of the same tap while a start is still in flight', async () => {
    window.localStorage.setItem(RADIO_KEY, 'on')
    const engine = fakeEngine()
    engine.start.mockImplementation(() => new Promise(() => {}))
    renderHook(() => useRadio(engine))
    await act(async () => fireEvent.pointerUp(document.body, { pointerType: 'touch' }))
    await act(async () => fireEvent.touchEnd(document.body))
    await act(async () => fireEvent.click(document.body))
    expect(engine.start).toHaveBeenCalledTimes(3)
  })

  it('does not count presses on controls marked data-radio-skip', async () => {
    window.localStorage.setItem(RADIO_KEY, 'on')
    const engine = fakeEngine()
    renderHook(() => useRadio(engine))
    const button = document.createElement('button')
    button.setAttribute('data-radio-skip', '')
    document.body.append(button)
    try {
      await act(async () => fireEvent.pointerDown(button, { pointerType: 'mouse' }))
      await act(async () => fireEvent.click(button))
      await act(async () => fireEvent.keyDown(button, { key: 'Enter' }))
      expect(engine.start).not.toHaveBeenCalled()
    } finally {
      button.remove()
    }
  })

  it('ignores a stale start result after OFF then ON', async () => {
    const engine = fakeEngine()
    let settleFirst
    engine.start
      .mockImplementationOnce(() => new Promise((r) => (settleFirst = r)))
      .mockImplementationOnce(async () => true)
    const { result } = renderHook(() => useRadio(engine))
    await act(async () => result.current.toggle()) // ON (slow)
    await act(async () => result.current.toggle()) // OFF
    await act(async () => result.current.toggle()) // ON (fast, running)
    expect(result.current.playing).toBe(true)
    await act(async () => settleFirst(false))
    expect(result.current.playing).toBe(true)
  })

  it("follows the engine's running state when it changes after start()", async () => {
    window.localStorage.setItem(RADIO_KEY, 'on')
    const engine = fakeEngine()
    let report
    engine.subscribe = vi.fn((fn) => {
      report = fn
      return () => {}
    })
    engine.start.mockResolvedValue(false) // resume slower than the cap
    const { result } = renderHook(() => useRadio(engine))
    await act(async () => fireEvent.keyDown(window, { key: 'a' }))
    expect(result.current.playing).toBe(false)
    act(() => report(true)) // the resume lands late
    expect(result.current.playing).toBe(true)
    act(() => report(false)) // OS interruption
    expect(result.current.playing).toBe(false)
  })

  it('ignores engine state reports while off', () => {
    const engine = fakeEngine()
    let report
    engine.subscribe = (fn) => {
      report = fn
      return () => {}
    }
    const { result } = renderHook(() => useRadio(engine))
    act(() => report(true))
    expect(result.current.playing).toBe(false)
  })

  it('muted: a remembered ON does not start on a gesture, and starts once unmuted', async () => {
    window.localStorage.setItem(RADIO_KEY, 'on')
    const engine = fakeEngine()
    const { rerender } = renderHook(({ muted }) => useRadio(engine, { muted }), {
      initialProps: { muted: true },
    })
    await act(async () => fireEvent.keyDown(window, { key: 'a' }))
    expect(engine.start).not.toHaveBeenCalled()
    rerender({ muted: false })
    await act(async () => fireEvent.keyDown(window, { key: 'a' }))
    expect(engine.start).toHaveBeenCalledTimes(1)
  })

  it('muted: suspends a playing radio, silences blips, and resumes when unmuted', async () => {
    const engine = fakeEngine()
    const { result, rerender } = renderHook(({ muted }) => useRadio(engine, { muted }), {
      initialProps: { muted: false },
    })
    await act(async () => result.current.toggle())
    rerender({ muted: true })
    expect(engine.suspend).toHaveBeenCalledTimes(1)
    act(() => result.current.blip('move'))
    expect(engine.blip).not.toHaveBeenCalled()
    expect(result.current.on).toBe(true)
    expect(window.localStorage.getItem(RADIO_KEY)).toBe('on')

    // Coming back from a hidden tab while still muted stays silent.
    act(() => setVisibility('hidden'))
    act(() => setVisibility('visible'))
    expect(engine.resume).not.toHaveBeenCalled()

    rerender({ muted: false })
    expect(engine.resume).toHaveBeenCalledTimes(1)
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
