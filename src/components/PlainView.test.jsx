import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PlainView from './PlainView'

describe('PlainView', () => {
  it('has one h1 and a heading per section', () => {
    render(<PlainView onClose={() => {}} />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const h2s = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(h2s).toEqual(
      expect.arrayContaining(['About', 'Skills', 'Projects', 'Experience', 'Achievements', 'Contact']),
    )
  })

  it('contains the headline numbers a recruiter is scanning for', () => {
    render(<PlainView onClose={() => {}} />)
    expect(screen.getByText('Casino Games')).toBeInTheDocument()
    const statsList = screen.getByRole('list', { name: /headline numbers/i })
    expect(within(statsList).getByText('67')).toBeInTheDocument()
    expect(screen.getAllByText(/bilions/i).length).toBeGreaterThan(0)
  })

  it('lists every project including the locked web missions', () => {
    render(<PlainView onClose={() => {}} />)
    expect(screen.getByText('Slot Empire (67+ Games)')).toBeInTheDocument()
    expect(screen.getByText(/realtime slot dashboard/i)).toBeInTheDocument()
  })

  it('returns to the menu', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<PlainView onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /menu/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
