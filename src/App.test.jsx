import { describe, it, expect } from 'vitest'
import { act } from 'react'
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

describe('App — Escape is scoped', () => {
  it('closes the case study on Escape without leaving the projects screen', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /projects/i }))
    await user.click(screen.getAllByRole('button', { name: /case file/i })[0])
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(document.documentElement).toHaveAttribute('data-screen', 'projects')
    expect(window.location.hash).toBe('#/projects')
  })

  it('leaves Escape inside a contact field to the field and keeps the text', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /contact/i }))
    const name = screen.getByLabelText(/name/i)
    await user.type(name, 'Ada')
    await user.keyboard('{Escape}')
    expect(document.documentElement).toHaveAttribute('data-screen', 'contact')
    expect(screen.getByLabelText(/name/i)).toHaveValue('Ada')
  })
})

describe('App — keyboard navigation', () => {
  it('keeps arrow-key navigation going past the first step', async () => {
    const user = userEvent.setup()
    render(<App />)
    // The desktop menu is the first tablist in document order.
    const [menu] = screen.getAllByRole('tablist')
    within(menu).getByRole('tab', { name: /start game/i }).focus()

    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-screen', 'about'))
    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-screen', 'skills'))
    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-screen', 'projects'))
    expect(within(menu).getByRole('tab', { name: /projects/i })).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-screen', 'skills'))
    await user.keyboard('{End}')
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-screen', 'exit'))
    await user.keyboard('{Home}')
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-screen', 'start'))
    expect(within(menu).getByRole('tab', { name: /start game/i })).toHaveFocus()
  })

  it('moves focus to the panel from the skip link without changing screen', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /about/i }))
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-screen', 'about'))
    const skip = screen.getByRole('link', { name: /skip to content/i })
    expect(skip).toHaveAttribute('href', '#panel-about')
    await user.click(skip)
    expect(screen.getByRole('tabpanel')).toHaveFocus()
    expect(document.documentElement).toHaveAttribute('data-screen', 'about')
    expect(window.location.hash).toBe('#/about')
  })
})

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

describe('App — swipe', () => {
  it('moves to the next screen on a left swipe', async () => {
    render(<App />)
    swipe(300, 100)
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-screen', 'about'))
  })

  it('ignores swipes while the menu sheet is open', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^menu$/i }))
    expect(screen.getByRole('dialog', { name: /menu/i })).toBeInTheDocument()
    swipe(300, 100)
    expect(document.documentElement).toHaveAttribute('data-screen', 'start')
  })

  it('ignores swipes while a case study is open', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /projects/i }))
    await user.click(screen.getAllByRole('button', { name: /case file/i })[0])
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
    swipe(300, 100)
    expect(document.documentElement).toHaveAttribute('data-screen', 'projects')
  })
})

describe('App — menu sheet focus', () => {
  it('focuses the active tab on open and returns focus to MENU on close', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /skills/i }))
    const menuButton = screen.getByRole('button', { name: /^menu$/i })
    await user.click(menuButton)
    const dialog = screen.getByRole('dialog', { name: /menu/i })
    expect(within(dialog).getByRole('tab', { name: /skills/i })).toHaveFocus()

    await user.click(within(dialog).getByRole('button', { name: /close/i }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(menuButton).toHaveFocus()
  })

  it('returns focus to MENU after closing the sheet with Escape', async () => {
    const user = userEvent.setup()
    render(<App />)
    const menuButton = screen.getByRole('button', { name: /^menu$/i })
    await user.click(menuButton)
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(menuButton).toHaveFocus()
  })

  it('closes the sheet when the backdrop is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^menu$/i }))
    await user.click(screen.getByTestId('sheet-backdrop'))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: /^menu$/i })).toHaveFocus()
  })
})

describe('App — name on small screens', () => {
  it('renders a compact wordmark in the MENU / PLAIN row', () => {
    render(<App />)
    const row = screen.getByRole('button', { name: /^menu$/i }).parentElement
    expect(row).toHaveTextContent(/kishan\s*jaiswal/i)
  })
})

describe('App — arrow keys inside the menu sheet', () => {
  it('keeps the sheet open and focus on the tabs while arrowing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /^menu$/i }))
    const dialog = screen.getByRole('dialog', { name: /menu/i })
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowDown}')
    await waitFor(() => expect(document.documentElement).toHaveAttribute('data-screen', 'skills'))
    expect(screen.getByRole('dialog', { name: /menu/i })).toBe(dialog)
    expect(within(dialog).getByRole('tab', { name: /skills/i })).toHaveFocus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(document.documentElement).toHaveAttribute('data-screen', 'skills')
  })
})
