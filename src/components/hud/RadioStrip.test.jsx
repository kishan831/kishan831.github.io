import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RadioStrip from './RadioStrip'

const toggle = () => screen.getByRole('button', { name: /kj-fm.*radio/i })

describe('RadioStrip', () => {
  it('is a toggle button that reads OFF and is not pressed by default', () => {
    render(<RadioStrip on={false} onToggle={() => {}} />)
    expect(toggle()).toHaveAttribute('aria-pressed', 'false')
    expect(toggle()).toHaveTextContent('OFF')
    expect(toggle()).toHaveTextContent('KJ-FM 96.7')
  })

  it('reads ON and is pressed when on', () => {
    render(<RadioStrip on onToggle={() => {}} />)
    expect(toggle()).toHaveAttribute('aria-pressed', 'true')
    expect(toggle()).toHaveTextContent('ON')
    expect(toggle()).not.toHaveTextContent('OFF')
  })

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn()
    render(<RadioStrip on={false} onToggle={onToggle} />)
    await userEvent.setup().click(toggle())
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('is a 44px tap target', () => {
    render(<RadioStrip on={false} onToggle={() => {}} />)
    expect(toggle()).toHaveClass('tap')
  })

  it('keeps the state text at or above bone/60', () => {
    const { rerender } = render(<RadioStrip on={false} onToggle={() => {}} />)
    const state = () => screen.getByTestId('radio-state')
    const ok = (el) => /(^|\s)text-bone(\/(60|70|80|90))?(\s|$)|text-\[var\(--accent\)\]/.test(el.className)
    expect(ok(state())).toBe(true)
    rerender(<RadioStrip on onToggle={() => {}} />)
    expect(ok(state())).toBe(true)
  })

  it('animates the EQ only when on and ambient motion is allowed', () => {
    const eq = () => screen.getByTestId('radio-eq')
    const { rerender } = render(<RadioStrip on={false} animate onToggle={() => {}} />)
    expect(eq()).toHaveAttribute('data-eq', 'off')
    rerender(<RadioStrip on animate={false} onToggle={() => {}} />)
    expect(eq()).toHaveAttribute('data-eq', 'off')
    rerender(<RadioStrip on animate onToggle={() => {}} />)
    expect(eq()).toHaveAttribute('data-eq', 'on')
  })

  it('hides the decorative EQ bars from assistive technology', () => {
    render(<RadioStrip on={false} onToggle={() => {}} />)
    expect(screen.getByTestId('radio-eq')).toHaveAttribute('aria-hidden', 'true')
  })
})
