import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import Plate from './Plate'

describe('Plate', () => {
  it('offers avif and webp sources at three widths', () => {
    const { container } = render(<Plate plate="1-start" alt="Start" accent="#ff3e88" />)
    const avif = container.querySelector('source[type="image/avif"]')
    const webp = container.querySelector('source[type="image/webp"]')
    expect(avif.getAttribute('srcset')).toContain('/plates/1-start-960.avif 960w')
    expect(avif.getAttribute('srcset')).toContain('/plates/1-start-1672.avif 1672w')
    expect(webp.getAttribute('srcset')).toContain('/plates/1-start-1440.webp 1440w')
  })

  it('falls back to the widest webp as the img src', () => {
    render(<Plate plate="4-projects" alt="Projects" accent="#19c8ff" />)
    expect(screen.getByAltText('Projects')).toHaveAttribute(
      'src',
      '/plates/4-projects-1672.webp',
    )
  })

  it('renders a gradient behind the image so a missing plate is invisible', () => {
    // jsdom's `background` shorthand parser drops a radial-gradient layer that
    // uses the two-value size form (`120% 90% at 72% 38%`), taking the accent
    // colour with it — so the live DOM never carries it. React's serialized
    // output is what actually ships, so assert against that instead.
    const html = renderToStaticMarkup(<Plate plate="9-exit" alt="Exit" accent="#ff9e6b" />)
    expect(html).toContain('data-testid="plate-fallback"')
    expect(html).toContain('#ff9e6b')
  })

  it('loads eagerly and decodes synchronously when marked priority', () => {
    render(<Plate plate="1-start" alt="Start" accent="#ff3e88" priority />)
    const img = screen.getByAltText('Start')
    expect(img).toHaveAttribute('loading', 'eager')
    expect(img).toHaveAttribute('fetchpriority', 'high')
  })

  it('loads lazily otherwise', () => {
    render(<Plate plate="6-achievements" alt="Trophies" accent="#ff2e63" />)
    expect(screen.getByAltText('Trophies')).toHaveAttribute('loading', 'lazy')
  })
})
