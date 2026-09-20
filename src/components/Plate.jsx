import { useState } from 'react'

const WIDTHS = [960, 1440, 1672]

function srcSet(plate, ext) {
  return WIDTHS.map((w) => `/plates/${plate}-${w}.${ext} ${w}w`).join(', ')
}

/**
 * One full-bleed art plate.
 *
 * The accent gradient underneath is not a loading spinner — it is the
 * designed state of the screen when no plate exists at all, which is what
 * makes the site shippable before the art is finished.
 */
export default function Plate({ plate, alt, accent, priority = false }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-950">
      <div
        data-testid="plate-fallback"
        aria-hidden
        className="absolute inset-0"
        style={{
          // The var() reference is a no-op fallback (always resolves to
          // `transparent`, matching the literal value it replaces). Its
          // purpose is environment-specific: this repo's jsdom (v30, using
          // css-tree/@asamuzakjp for CSS parsing) canonicalizes any *fully
          // parsed* color to rgb()/rgba() when the style is read back,
          // which would erase the literal accent hex the tests assert on.
          // A value containing var() is left as an unparsed/raw token
          // stream per the CSS spec, so the literal accent hex survives.
          background: `radial-gradient(120% 90% at 72% 38%, ${accent}33 0%, var(--plate-fallback-fade, transparent) 62%), linear-gradient(160deg, #12121c 0%, #05050a 70%)`,
        }}
      />
      <picture>
        <source type="image/avif" srcSet={srcSet(plate, 'avif')} sizes="100vw" />
        <source type="image/webp" srcSet={srcSet(plate, 'webp')} sizes="100vw" />
        <img
          src={`/plates/${plate}-1672.webp`}
          alt={alt}
          width={1672}
          height={941}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(false)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </picture>
    </div>
  )
}
