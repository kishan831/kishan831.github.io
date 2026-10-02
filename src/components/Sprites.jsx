/**
 * Hand-placed loops over specific points in each plate. Positions are
 * percentages of the frame, matched to the art by eye.
 */
const SPRITES = {
  start: [
    { cls: 'fx-heli', style: { top: '13%', left: '30%', width: '3%', aspectRatio: '1' }, glow: false },
    { cls: 'fx-twinkle', style: { top: '46%', left: '14%', width: '18%', height: '10%' } },
  ],
  about: [{ cls: 'fx-twinkle', style: { top: '40%', left: '42%', width: '22%', height: '8%' } }],
  skills: [
    { cls: 'fx-steam', style: { top: '62%', left: '31%', width: '5%', height: '14%' } },
    { cls: 'fx-twinkle', style: { top: '18%', left: '78%', width: '14%', height: '12%' } },
  ],
  projects: [{ cls: 'fx-twinkle', style: { top: '22%', left: '26%', width: '38%', height: '34%' } }],
  experience: [{ cls: 'fx-twinkle', style: { top: '38%', left: '18%', width: '54%', height: '26%' } }],
  achievements: [{ cls: 'fx-twinkle', style: { top: '20%', left: '62%', width: '32%', height: '46%' } }],
  academy: [
    { cls: 'fx-steam', style: { top: '70%', left: '24%', width: '5%', height: '13%' } },
    { cls: 'fx-twinkle', style: { top: '26%', left: '60%', width: '26%', height: '22%' } },
  ],
  contact: [{ cls: 'fx-twinkle', style: { top: '22%', left: '30%', width: '38%', height: '26%' } }],
  exit: [
    { cls: 'fx-heli', style: { top: '17%', left: '48%', width: '3%', aspectRatio: '1' } },
    { cls: 'fx-twinkle', style: { top: '58%', left: '52%', width: '16%', height: '18%' } },
  ],
}

export default function Sprites({ screenId, enabled }) {
  if (!enabled) return null
  const list = SPRITES[screenId]
  if (!list) return null

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {list.map((sprite, i) => (
        <span
          key={i}
          className={`absolute ${sprite.cls}`}
          style={sprite.style}
        />
      ))}
    </div>
  )
}
