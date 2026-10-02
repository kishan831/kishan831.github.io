import { describe, it, expect } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
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

  it('opens the menu sheet, switches screen and closes it', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^menu$/i }))
    const dialog = screen.getByRole('dialog', { name: /menu/i })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    const tab = within(dialog).getByRole('tab', { name: /skills/i })
    await user.click(tab)
    await waitFor(() =>
      expect(document.documentElement).toHaveAttribute('data-screen', 'skills'),
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('closes the sheet on Escape without leaving the current screen', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /projects/i }))
    await user.click(screen.getByRole('button', { name: /^menu$/i }))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(document.documentElement).toHaveAttribute('data-screen', 'projects')
  })

  it('keeps the plain résumé control reachable outside the sheet', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /^plain$/i })).toBeInTheDocument()
  })
})
