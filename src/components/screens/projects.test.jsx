import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScreenBody from './ScreenBody'

describe('projects screen', () => {
  it('splits work into casino ops and web ops', () => {
    render(<ScreenBody screenId="projects" />)
    expect(screen.getByText(/casino ops/i)).toBeInTheDocument()
    expect(screen.getByText(/web ops/i)).toBeInTheDocument()
  })

  it('lists the flagship casino mission', () => {
    render(<ScreenBody screenId="projects" />)
    expect(screen.getByText(/slot empire/i)).toBeInTheDocument()
  })

  it('renders locked web missions as non-links marked in development', () => {
    render(<ScreenBody screenId="projects" />)
    const locked = screen.getAllByTestId('mission-locked')
    expect(locked.length).toBeGreaterThan(0)
    for (const el of locked) {
      expect(el.tagName).not.toBe('A')
      expect(el).toHaveTextContent(/in development/i)
    }
  })

  it('opens a case study from a flagship mission', async () => {
    const user = userEvent.setup()
    render(<ScreenBody screenId="projects" />)
    await user.click(screen.getAllByRole('button', { name: /case file/i })[0])
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })
})

describe('experience screen', () => {
  it('pins the current role', () => {
    render(<ScreenBody screenId="experience" />)
    expect(screen.getByTestId('current-role')).toHaveTextContent(/bilions/i)
  })

  it('lists every past role', () => {
    render(<ScreenBody screenId="experience" />)
    expect(screen.getByText(/phibonacci/i)).toBeInTheDocument()
    expect(screen.getByText(/outscal/i)).toBeInTheDocument()
  })
})

describe('achievements screen', () => {
  it('lists trophies with real metrics', () => {
    render(<ScreenBody screenId="achievements" />)
    expect(screen.getByText(/67\+ casino games/i)).toBeInTheDocument()
    expect(screen.getByText(/best project award/i)).toBeInTheDocument()
  })
})
