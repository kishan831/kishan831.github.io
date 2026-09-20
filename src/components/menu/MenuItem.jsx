import { Check } from 'lucide-react'
import { forwardRef } from 'react'

const MenuItem = forwardRef(function MenuItem(
  { screen, isActive, isVisited, onSelect },
  ref,
) {
  const { id, label, Icon } = screen

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={`tab-${id}`}
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      tabIndex={isActive ? 0 : -1}
      data-visited={isVisited ? 'true' : 'false'}
      onClick={() => onSelect(id)}
      className={`tap group relative flex w-full items-center gap-3 px-3 text-left font-mono text-[13px] tracking-[0.14em] transition-colors duration-200 ${
        isActive ? 'text-ink-950' : 'text-bone/80 hover:text-bone'
      }`}
      style={isActive ? { background: 'var(--accent)' } : undefined}
    >
      <Icon size={15} aria-hidden className="shrink-0 opacity-90" />
      <span className="flex-1 truncate">{label}</span>
      {isVisited && (
        <Check
          size={14}
          aria-hidden
          className={isActive ? 'text-ink-950' : 'text-[var(--accent)]'}
        />
      )}
    </button>
  )
})

export default MenuItem
