import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScreenBody from './ScreenBody'

describe('screen bodies', () => {
  it('shows the real headline stats on the start screen', () => {
    render(<ScreenBody screenId="start" />)
    expect(screen.getByText('67')).toBeInTheDocument()
    expect(screen.getByText(/casino games/i)).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('shows availability and both disciplines on the start screen', () => {
    render(<ScreenBody screenId="start" />)
    expect(screen.getByText(/open to opportunities/i)).toBeInTheDocument()
    expect(screen.getByText(/games people play/i)).toBeInTheDocument()
  })

  it('lists location, role and experience rows on the about screen', () => {
    render(<ScreenBody screenId="about" />)
    expect(screen.getByText(/experience/i)).toBeInTheDocument()
    expect(screen.getByText(/unity developer/i)).toBeInTheDocument()
    expect(screen.getByText(/bilions/i)).toBeInTheDocument()
  })

  it('measures every skill bar in a real unit, never a percentage', () => {
    render(<ScreenBody screenId="skills" />)
    const units = screen.getAllByTestId('capability-unit')
    expect(units.length).toBeGreaterThan(4)
    for (const el of units) {
      expect(el.textContent).not.toMatch(/%/)
    }
  })

  it('gives each capability bar an accessible value', () => {
    render(<ScreenBody screenId="skills" />)
    const bars = screen.getAllByRole('img', { name: /unity|slot|team|multiplayer/i })
    expect(bars.length).toBeGreaterThan(2)
  })
})
