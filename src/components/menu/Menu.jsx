import { useEffect, useRef } from 'react'
import { screens, screenIds } from '../../data/screens'
import MenuItem from './MenuItem'

/**
 * Vertical tablist. Roving tabindex keeps a single tab stop for the whole
 * menu, which is what the ARIA pattern expects and what stops keyboard users
 * tabbing through nine controls to reach the content.
 */
export default function Menu({ activeId, isVisited, onSelect }) {
  const refs = useRef({})
  const activeIndex = screenIds.indexOf(activeId)

  // Focus follows selection only when focus is already inside the menu, so
  // clicking a tab does not yank focus away from wherever the user was.
  useEffect(() => {
    const el = refs.current[activeId]
    if (!el) return
    const insideMenu = el.parentElement?.contains(document.activeElement)
    if (insideMenu) el.focus()
  }, [activeId])

  function onKeyDown(event) {
    const last = screenIds.length - 1
    let next = null

    if (event.key === 'ArrowDown') next = activeIndex >= last ? 0 : activeIndex + 1
    else if (event.key === 'ArrowUp') next = activeIndex <= 0 ? last : activeIndex - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else return

    event.preventDefault()
    onSelect(screenIds[next])
  }

  return (
    <div
      role="tablist"
      aria-orientation="vertical"
      aria-label="Portfolio sections"
      onKeyDown={onKeyDown}
      className="flex w-full flex-col gap-0.5"
    >
      {screens.map((screen) => (
        <MenuItem
          key={screen.id}
          ref={(el) => {
            refs.current[screen.id] = el
          }}
          screen={screen}
          isActive={screen.id === activeId}
          isVisited={isVisited(screen.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
