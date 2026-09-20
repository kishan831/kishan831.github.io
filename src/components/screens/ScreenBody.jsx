import { getScreen } from '../../data/screens'

/** Replaced screen by screen in Tasks 11-13. */
export default function ScreenBody({ screenId }) {
  const screen = getScreen(screenId)
  return (
    <div>
      <h1 className="font-display text-[var(--fs-screen)] uppercase italic leading-none text-bone">
        {screen.label}
      </h1>
    </div>
  )
}
