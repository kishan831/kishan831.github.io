import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act } from 'react'
import { render, screen, waitFor, within, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

// jsdom has no Web Audio; the app's engine is replaced with a recording fake.
const engine = vi.hoisted(() => ({
  start: vi.fn(async () => true),
  stop: vi.fn(),
  blip: vi.fn(),
  suspend: vi.fn(),
  resume: vi.fn(),
}))
vi.mock('./audio/radio', () => ({ radio: engine }))

beforeEach(() => {
  vi.clearAllMocks()
  engine.start.mockImplementation(async () => true)
})

const radioButton = () => screen.getByRole('button', { name: /kj-fm.*radio/i })

function swipe(fromX, toX, y = 300) {
  const fire = (type, x) => {
    const event = new Event(type, { bubbles: true })
    Object.defineProperty(event, 'changedTouches', { value: [{ clientX: x, clientY: y }] })
    window.dispatchEvent(event)
  }
  act(() => {
    fire('touchstart', fromX)
    fire('touchend', toX)
  })
}

describe('App — KJ-FM radio', () => {
  it('starts OFF and plays nothing on load', () => {
    render(<App />)
    expect(radioButton()).toHaveAttribute('aria-pressed', 'false')
    expect(engine.start).not.toHaveBeenCalled()
  })

  it('makes no menu sounds while OFF', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /skills/i }))
    const [menu] = screen.getAllByRole('tablist')
    within(menu).getByRole('tab', { name: /skills/i }).focus()
    await user.keyboard('{ArrowDown}')
    swipe(300, 100)
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-screen', 'experience'))
    expect(engine.blip).not.toHaveBeenCalled()
  })

  it('toggles ON from the HUD and persists it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(radioButton())
    expect(radioButton()).toHaveAttribute('aria-pressed', 'true')
    expect(engine.start).toHaveBeenCalledTimes(1)
    expect(window.localStorage.getItem('kj-radio')).toBe('on')
    await user.click(radioButton())
    expect(radioButton()).toHaveAttribute('aria-pressed', 'false')
    expect(engine.stop).toHaveBeenCalledTimes(1)
    expect(window.localStorage.getItem('kj-radio')).toBe('off')
  })

  it('plays the select confirm when a screen is clicked while ON', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(radioButton())
    await user.click(screen.getByRole('tab', { name: /skills/i }))
    expect(engine.blip).toHaveBeenLastCalledWith('select')
  })

  it('plays the move blip on arrow / Home / End in the menu while ON', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(radioButton())
    const [menu] = screen.getAllByRole('tablist')
    within(menu).getByRole('tab', { name: /start game/i }).focus()
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{End}')
    await user.keyboard('{Home}')
    expect(engine.blip.mock.calls).toEqual([['move'], ['move'], ['move']])
  })

  it('plays the move blip on a swipe while ON', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(radioButton())
    swipe(300, 100)
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-screen', 'about'))
    expect(engine.blip).toHaveBeenCalledWith('move')
  })

  it('does not blip for a swipe that goes nowhere', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(radioButton())
    swipe(100, 300) // right swipe on the first screen
    expect(engine.blip).not.toHaveBeenCalled()
  })

  it('blips move for arrows and select for a tap inside the menu sheet', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(radioButton())
    await user.click(screen.getByRole('button', { name: /^menu$/i }))
    await user.keyboard('{ArrowDown}')
    expect(engine.blip).toHaveBeenLastCalledWith('move')
    const dialog = screen.getByRole('dialog', { name: /menu/i })
    await user.click(within(dialog).getByRole('tab', { name: /contact/i }))
    expect(engine.blip).toHaveBeenLastCalledWith('select')
  })

  it('remembers ON but only starts on the first pointerdown, not on load', async () => {
    window.localStorage.setItem('kj-radio', 'on')
    render(<App />)
    expect(radioButton()).toHaveAttribute('aria-pressed', 'true')
    expect(engine.start).not.toHaveBeenCalled()
    await act(async () => fireEvent.pointerDown(document.body, { pointerType: 'mouse' }))
    expect(engine.start).toHaveBeenCalledTimes(1)
  })

  it('remembers ON and starts on the first keydown, then that key still blips', async () => {
    window.localStorage.setItem('kj-radio', 'on')
    const user = userEvent.setup()
    render(<App />)
    const [menu] = screen.getAllByRole('tablist')
    within(menu).getByRole('tab', { name: /start game/i }).focus()
    await user.keyboard('{ArrowDown}')
    expect(engine.start).toHaveBeenCalledTimes(1)
    expect(engine.blip).toHaveBeenCalledWith('move')
    expect(engine.start.mock.invocationCallOrder[0]).toBeLessThan(engine.blip.mock.invocationCallOrder[0])
  })

  it('plays the select confirm when a focused tab is chosen with Enter', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(radioButton())
    const [menu] = screen.getAllByRole('tablist')
    within(menu).getByRole('tab', { name: /skills/i }).focus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-screen', 'skills'))
    expect(engine.blip).toHaveBeenLastCalledWith('select')
  })

  it('remembers ON and, on a touch tap, starts on the pointerup rather than the pointerdown', async () => {
    window.localStorage.setItem('kj-radio', 'on')
    render(<App />)
    await act(async () => fireEvent.pointerDown(document.body, { pointerType: 'touch' }))
    expect(engine.start).not.toHaveBeenCalled()
    await act(async () => fireEvent.pointerUp(document.body, { pointerType: 'touch' }))
    expect(engine.start).toHaveBeenCalledTimes(1)
  })

  it('silences a playing radio in the plain résumé view and resumes it on the way back', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(radioButton())
    await user.click(screen.getAllByRole('button', { name: /plain/i })[0])
    expect(engine.suspend).toHaveBeenCalledTimes(1)
    expect(engine.stop).not.toHaveBeenCalled()
    swipe(300, 100)
    expect(engine.blip).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /back to the menu/i }))
    expect(radioButton()).toHaveAttribute('aria-pressed', 'true')
    expect(engine.resume).toHaveBeenCalledTimes(1)
  })

  it('with a remembered ON, pressing PLAIN does not start the radio there', async () => {
    window.localStorage.setItem('kj-radio', 'on')
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getAllByRole('button', { name: /plain/i })[0])
    expect(screen.getByRole('button', { name: /back to the menu/i })).toBeInTheDocument()
    await user.keyboard('a')
    await user.click(document.body)
    expect(engine.start).not.toHaveBeenCalled()
  })

  it('turning a remembered ON off with the toggle never starts it', async () => {
    window.localStorage.setItem('kj-radio', 'on')
    const user = userEvent.setup()
    render(<App />)
    await user.click(radioButton())
    expect(radioButton()).toHaveAttribute('aria-pressed', 'false')
    expect(engine.start).not.toHaveBeenCalled()
  })
})
