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

  it('hides decoration from assistive technology', () => {
    const { container } = render(
      <Hud objective="X" stars={1} shipped={7} ratio={0.11} />,
    )
    expect(container.querySelector('[data-testid="radio"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    expect(container.querySelector('[data-testid="minimap"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })
})
