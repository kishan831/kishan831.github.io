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
          background: `radial-gradient(120% 90% at 72% 38%, ${accent}33 0%, transparent 62%), linear-gradient(160deg, #12121c 0%, #05050a 70%)`,
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
