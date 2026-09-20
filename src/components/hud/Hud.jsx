import Clock from './Clock'
import Stars from './Stars'
import ShippedCounter from './ShippedCounter'
import Minimap from './Minimap'
import Objective from './Objective'
import KeyHints from './KeyHints'
import JourneyBar from './JourneyBar'
import RadioStrip from './RadioStrip'

/**
 * Frames every screen. Owns no state — everything is passed in, so the HUD
 * can be rendered in isolation in a test or a plain view.
 *
 * Every element is rendered exactly once in the DOM; only its visibility
 * (via Tailwind's responsive `hidden`/`block`/`flex` utilities) varies by
 * breakpoint. Do not reintroduce duplicate copies of an element to achieve
 * a responsive layout — that double-announces content like the clock to
 * assistive technology at every width, not only under test.
 */
export default function Hud({ objective, stars, shipped, ratio }) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between p-[var(--hud-pad)]">
        <div className="hidden sm:block">
          <RadioStrip />
        </div>

        <div className="flex flex-col items-end gap-1">
          <Clock />
          <Stars stars={stars} />
          <span className="hidden sm:block">
            <ShippedCounter shipped={shipped} />
          </span>
          <p aria-hidden className="hud-label mt-1 hidden text-right leading-[1.6] md:block">
            Discipline
            <br />
            creates
            <br />
            freedom
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30">
        <div className="scrim-bottom pt-16">
          <div className="flex items-end justify-between gap-4 p-[var(--hud-pad)]">
            <div className="flex min-w-0 items-center gap-3">
              <span className="hidden sm:block">
                <Minimap ratio={ratio} />
              </span>
              <Objective objective={objective} />
            </div>
            <div className="hidden flex-col items-end gap-2 lg:flex">
              <KeyHints />
              <JourneyBar ratio={ratio} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
