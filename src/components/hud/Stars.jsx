import { Star } from 'lucide-react'

export default function Stars({ stars }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={12}
          data-star={i < stars ? 'on' : 'off'}
          className={i < stars ? 'fill-[var(--accent)] text-[var(--accent)]' : 'text-bone/25'}
        />
      ))}
    </span>
  )
}
