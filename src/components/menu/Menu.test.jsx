import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Menu from './Menu'

const noneVisited = () => false

function setup(props = {}) {
  const onSelect = vi.fn()
  render(
    <Menu activeId="start" isVisited={noneVisited} onSelect={onSelect} {...props} />,
  )
  return { onSelect, user: userEvent.setup() }
}

describe('Menu', () => {
  it('is a vertical tablist of nine tabs', () => {
    setup()
    const list = screen.getByRole('tablist')
    expect(list).toHaveAttribute('aria-orientation', 'vertical')
    expect(screen.getAllByRole('tab')).toHaveLength(9)
  })

  it('marks only the active tab as selected and focusable', () => {
    setup()
    const start = screen.getByRole('tab', { name: /start game/i })
    const skills = screen.getByRole('tab', { name: /skills/i })
    expect(start).toHaveAttribute('aria-selected', 'true')
    expect(start).toHaveAttribute('tabindex', '0')
    expect(skills).toHaveAttribute('tabindex', '-1')
  })

  it('points each tab at its panel', () => {
    setup()
    expect(screen.getByRole('tab', { name: /contact/i })).toHaveAttribute(
      'aria-controls',
      'panel-contact',
    )
  })

  it('selects on click', async () => {
    const { onSelect, user } = setup()
    await user.click(screen.getByRole('tab', { name: /projects/i }))
    expect(onSelect).toHaveBeenCalledWith('projects')
  })

  it('moves down with ArrowDown', async () => {
    const { onSelect, user } = setup()
    screen.getByRole('tab', { name: /start game/i }).focus()
    await user.keyboard('{ArrowDown}')
    expect(onSelect).toHaveBeenCalledWith('about')
  })

  it('wraps from the last tab back to the first', async () => {
    const { onSelect, user } = setup({ activeId: 'exit' })
    screen.getByRole('tab', { name: /exit game/i }).focus()
    await user.keyboard('{ArrowDown}')
    expect(onSelect).toHaveBeenCalledWith('start')
  })

  it('jumps to the ends with Home and End', async () => {
    const { onSelect, user } = setup({ activeId: 'skills' })
    screen.getByRole('tab', { name: /skills/i }).focus()
    await user.keyboard('{End}')
    expect(onSelect).toHaveBeenCalledWith('exit')
    await user.keyboard('{Home}')
    expect(onSelect).toHaveBeenCalledWith('start')
  })

  it('shows a checkmark only on visited entries', () => {
    render(
      <Menu
        activeId="start"
        isVisited={(id) => id === 'skills'}
        onSelect={() => {}}
      />,
    )
    expect(screen.getByRole('tab', { name: /skills/i })).toHaveAttribute(
      'data-visited',
      'true',
    )
    expect(screen.getByRole('tab', { name: /contact/i })).toHaveAttribute(
      'data-visited',
      'false',
    )
  })
})
