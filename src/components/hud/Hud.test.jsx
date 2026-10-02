import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hud from './Hud'

describe('Hud', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-20T18:56:00'))
  })
  afterEach(() => vi.useRealTimers())

  it('shows the current objective as readable text', () => {
    render(<Hud objective="REVIEW UNLOCKED ABILITIES" stars={2} shipped={15} ratio={0.22} />)
    expect(screen.getByText('REVIEW UNLOCKED ABILITIES')).toBeInTheDocument()
  })

  it('shows the local time at minute resolution', () => {
    render(<Hud objective="X" stars={0} shipped={0} ratio={0} />)
    expect(screen.getByText('18:56')).toBeInTheDocument()
  })

  it('shows the shipped count', () => {
    render(<Hud objective="X" stars={3} shipped={40} ratio={0.6} />)
    expect(screen.getByText(/40/)).toBeInTheDocument()
  })

  it('renders five stars with the earned ones marked', () => {
    const { container } = render(
      <Hud objective="X" stars={3} shipped={40} ratio={0.6} />,
    )
    const all = container.querySelectorAll('[data-star]')
    expect(all).toHaveLength(5)
    expect(container.querySelectorAll('[data-star="on"]')).toHaveLength(3)
  })

  // Changed for the KJ-FM radio: this used to assert the radio strip was
  // aria-hidden decoration. It is now a real toggle, so it must be exposed to
  // assistive technology; the minimap is still decoration and stays hidden.
  it('hides decoration from assistive technology', () => {
    const { container } = render(
      <Hud objective="X" stars={1} shipped={7} ratio={0.11} />,
    )
    expect(container.querySelector('[data-testid="minimap"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    const radio = screen.getByRole('button', { name: /kj-fm.*radio/i })
    expect(radio.closest('[aria-hidden="true"]')).toBeNull()
  })

  // New: the strip used to sit in a `hidden sm:block` wrapper (phones never
  // saw it). The toggle has to be reachable at every width.
  it('shows the radio toggle at every width', () => {
    render(<Hud objective="X" stars={1} shipped={7} ratio={0.11} />)
    let el = screen.getByRole('button', { name: /kj-fm.*radio/i })
    while (el) {
      expect(el.classList?.contains('hidden') ?? false).toBe(false)
      el = el.parentElement
    }
  })

  it('passes radio state and the toggle through to the strip', () => {
    const onRadioToggle = vi.fn()
    render(
      <Hud objective="X" stars={1} shipped={7} ratio={0.11} radioOn onRadioToggle={onRadioToggle} />,
    )
    const radio = screen.getByRole('button', { name: /kj-fm.*radio/i })
    expect(radio).toHaveAttribute('aria-pressed', 'true')
    radio.click()
    expect(onRadioToggle).toHaveBeenCalledTimes(1)
  })
})
