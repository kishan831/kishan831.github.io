import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('opens on the start screen', async () => {
    render(<App />)
    await waitFor(() =>
      expect(document.documentElement).toHaveAttribute('data-screen', 'start'),
    )
  })

  it('switches screens and retints the document', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /skills/i }))
    await waitFor(() =>
      expect(document.documentElement).toHaveAttribute('data-screen', 'skills'),
    )
    expect(window.location.hash).toBe('#/skills')
  })

  it('exposes the active screen as a labelled tabpanel', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /contact/i }))
    const panel = await screen.findByRole('tabpanel')
    expect(panel).toHaveAttribute('id', 'panel-contact')
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-contact')
  })

  it('marks a screen visited once opened', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /achievements/i }))
    await waitFor(() =>
      expect(screen.getByRole('tab', { name: /achievements/i })).toHaveAttribute(
        'data-visited',
        'true',
      ),
    )
  })

  it('announces the new screen politely', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /experience/i }))
    const live = document.querySelector('[aria-live="polite"]')
    await waitFor(() => expect(live).toHaveTextContent(/experience/i))
  })

  it('returns to the start screen on Escape', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /projects/i }))
    await user.keyboard('{Escape}')
    await waitFor(() =>
      expect(document.documentElement).toHaveAttribute('data-screen', 'start'),
    )
  })
})
