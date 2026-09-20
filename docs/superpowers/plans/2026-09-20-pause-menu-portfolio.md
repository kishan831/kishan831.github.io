# Pause Menu Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild kishan831.github.io as a game pause menu — nine tab-driven screens over full-bleed illustrated plates, with a persistent HUD, per-screen accent retinting, and a plain résumé view for recruiters.

**Architecture:** One config file (`src/data/screens.js`) drives all nine screens. A hash route selects the active screen; a `data-screen` attribute on `<html>` swaps CSS custom properties so the whole interface retints without a re-render. The HUD, menu and plate are presentational components reading from a single state hook. Every existing section component is replaced.

**Tech Stack:** React 19.3, Vite 8.3, Tailwind 4.3 (CSS-first `@theme`), motion 13.4, Vitest + React Testing Library. Build-time image conversion with `sharp`.

**Spec:** `docs/superpowers/specs/2026-09-20-portfolio-pause-menu-design.md`
**Art prompts:** `docs/superpowers/specs/2026-09-20-art-plate-prompts.md`

## Global Constraints

Every task's requirements implicitly include these. Values copied from the spec.

- **No new runtime dependencies.** React, react-dom, motion, lucide-react only. Build-time dev dependencies are fine.
- **Forbidden:** WebGL, three.js, GSAP, Astro, a blog, internationalisation, autoplaying audio, self-hosted video.
- **Motion:** transform and opacity only. No continuous JS animation loops. All ambient motion IntersectionObserver-gated, and disabled under `prefers-reduced-motion: reduce` and `navigator.connection.saveData`.
- **JavaScript budget:** ≤180KB gzip total.
- **Performance:** LCP ≤2.5s on simulated 4G mobile, CLS 0, first screen transfer ≤600KB.
- **Plate budget:** ≤200KB per plate at full width, AVIF with WebP fallback, widths 960 / 1440 / 1672.
- **Accessibility:** WCAG AA contrast on every screen accent against its scrim. Menu is a real `tablist`. All interactive targets ≥44px.
- **Viewport units:** `svh` / `dvh` only, never bare `vh`.
- **Device matrix (release gate):** 320, 390, 768, 1024, 1440, 1920px, plus landscape phone at 844×390. No horizontal overflow at any width.
- **Copy rule:** stats are real and verifiable — 5 years, 50+ projects, 67+ casino games, 30+ built from scratch, 15 developers led. Never invent a percentage.
- **No location watermark.** Removed at Kishan's request.

---

## File Structure

**Created:**

| File | Responsibility |
|---|---|
| `src/data/screens.js` | The nine screens: id, label, accent, objective, plate, icon. Single source of truth. |
| `src/state/useHashRoute.js` | Reads and writes `#/screen-id`; nothing else. |
| `src/state/useProgress.js` | Visited set, derived stars and shipped count, `localStorage` persistence. |
| `src/state/useAmbientMotion.js` | One place deciding whether ambient motion may run. |
| `src/components/Plate.jsx` | One art plate: gradient fallback, responsive sources, decode handling. |
| `src/components/PlateFX.jsx` | Ambient layer — grain, light sweep, neon pulse, Ken Burns. |
| `src/components/Sprites.jsx` | Per-plate hand-placed sprite loops. |
| `src/components/Parallax.jsx` | Three-layer pointer parallax, start screen only. |
| `src/components/menu/Menu.jsx` | Tablist, roving tabindex, keyboard navigation. |
| `src/components/menu/MenuItem.jsx` | One menu row with its visited checkmark. |
| `src/components/hud/Hud.jsx` | Composes the HUD; owns no state. |
| `src/components/hud/Clock.jsx` | Live local time, minute resolution. |
| `src/components/hud/Stars.jsx` | Five-star progression readout. |
| `src/components/hud/ShippedCounter.jsx` | Counts toward 67 as screens are visited. |
| `src/components/hud/Minimap.jsx` | Progress plot. |
| `src/components/hud/Objective.jsx` | Current objective line. |
| `src/components/hud/KeyHints.jsx` | Keyboard hints, or swipe hints on touch. |
| `src/components/hud/JourneyBar.jsx` | "A developer's journey continues" progress rule. |
| `src/components/hud/RadioStrip.jsx` | Station brand with level meter. Decorative. |
| `src/components/Toast.jsx` | "MISSION PASSED" on first visit. |
| `src/components/Splash.jsx` | Loading splash over the first plate decode. |
| `src/components/PlainView.jsx` | Every screen's content as one conventional document. |
| `src/components/screens/*.jsx` | Nine screen bodies. |
| `scripts/build-plates.mjs` | Converts `reference/plates-source/*.png` to responsive AVIF and WebP. |
| `vitest.setup.js` | Testing Library matchers, `matchMedia` stub. |

**Modified:** `src/App.jsx`, `src/main.jsx`, `src/index.css`, `src/data/portfolio.js`, `index.html`, `vite.config.js`, `package.json`.

**Deleted in Task 15:** `Hero.jsx`, `HeroFX.jsx`, `Nav.jsx`, `About.jsx`, `Skills.jsx`, `Experience.jsx`, `Projects.jsx`, `Contact.jsx`, `Footer.jsx`, `ScrollTop.jsx`, `primitives.jsx`.

**Kept:** `BrandIcons.jsx`, `CaseStudyModal.jsx`, `data/portfolio.js`.

---

### Task 1: Test infrastructure

**Files:**
- Modify: `package.json`, `vite.config.js`
- Create: `vitest.setup.js`, `src/data/screens.test.js`

**Interfaces:**
- Produces: `npm test` runs Vitest in jsdom with Testing Library matchers loaded.

- [ ] **Step 1: Install dev dependencies**

```bash
npm install -D vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

- [ ] **Step 2: Create the setup file**

`vitest.setup.js`:

```js
import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  window.location.hash = ''
})

// jsdom implements neither of these, and both are read on first render.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
```

- [ ] **Step 3: Add the Vitest config to `vite.config.js`**

Add a `test` key to the existing `defineConfig` object, leaving `base`, `plugins` and `build` untouched:

```js
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
  },
```

- [ ] **Step 4: Add the scripts to `package.json`**

```json
    "test": "vitest run",
    "test:watch": "vitest"
```

- [ ] **Step 5: Write a failing test that proves the harness works**

`src/data/screens.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { screens } from './screens'

describe('screens config', () => {
  it('exports nine screens', () => {
    expect(screens).toHaveLength(9)
  })
})
```

- [ ] **Step 6: Run it and confirm it fails for the right reason**

Run: `npm test`
Expected: FAIL — cannot resolve `./screens`.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js vitest.setup.js src/data/screens.test.js
git commit -m "test: add Vitest and Testing Library harness"
```

---

### Task 2: Screen configuration

**Files:**
- Create: `src/data/screens.js`
- Modify: `src/data/screens.test.js`

**Interfaces:**
- Produces: `screens` — an array of nine objects, each `{ id, label, accent, accentHi, objective, plate, Icon }`. `screenIds` — array of the nine ids in order. `getScreen(id)` — returns a screen or `undefined`. `DEFAULT_SCREEN_ID` — the string `'start'`.

- [ ] **Step 1: Write the failing tests**

Replace `src/data/screens.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { screens, screenIds, getScreen, DEFAULT_SCREEN_ID } from './screens'

describe('screens config', () => {
  it('exports nine screens', () => {
    expect(screens).toHaveLength(9)
  })

  it('starts at the start screen', () => {
    expect(DEFAULT_SCREEN_ID).toBe('start')
    expect(screens[0].id).toBe('start')
  })

  it('gives every screen a unique id', () => {
    expect(new Set(screenIds).size).toBe(9)
  })

  it('gives every screen an accent, an objective and a plate', () => {
    for (const s of screens) {
      expect(s.accent).toMatch(/^#[0-9a-f]{6}$/i)
      expect(s.accentHi).toMatch(/^#[0-9a-f]{6}$/i)
      expect(s.objective.length).toBeGreaterThan(8)
      expect(s.plate).toMatch(/^\d-[a-z]+$/)
    }
  })

  it('looks a screen up by id', () => {
    expect(getScreen('contact').label).toBe('CONTACT')
    expect(getScreen('nope')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test`
Expected: FAIL — cannot resolve `./screens`.

- [ ] **Step 3: Write the config**

`src/data/screens.js`:

```js
import {
  Play, User, Code2, FolderGit2, Briefcase, Trophy, GraduationCap, Mail, Power,
} from 'lucide-react'

/**
 * The nine screens. This is the only file to edit when content changes —
 * no component reads anything hard-coded about a specific screen.
 *
 * plate: basename under /plates/, resolved to responsive AVIF and WebP.
 */
export const screens = [
  {
    id: 'start',
    label: 'START GAME',
    Icon: Play,
    accent: '#ff3e88',
    accentHi: '#ff7ab0',
    objective: 'BUILD NEXT-LEVEL REAL-TIME SYSTEMS',
    plate: '1-start',
    parallax: true,
  },
  {
    id: 'about',
    label: 'ABOUT ME',
    Icon: User,
    accent: '#ff8a3d',
    accentHi: '#ffad74',
    objective: 'LEARN WHO YOU ARE DEALING WITH',
    plate: '2-about',
  },
  {
    id: 'skills',
    label: 'SKILLS',
    Icon: Code2,
    accent: '#7c6cff',
    accentHi: '#a79bff',
    objective: 'REVIEW UNLOCKED ABILITIES',
    plate: '3-skills',
  },
  {
    id: 'projects',
    label: 'PROJECTS',
    Icon: FolderGit2,
    accent: '#19c8ff',
    accentHi: '#6bdcff',
    objective: 'INSPECT THE COMPLETED BUILDS',
    plate: '4-projects',
  },
  {
    id: 'experience',
    label: 'EXPERIENCE',
    Icon: Briefcase,
    accent: '#5b7cff',
    accentHi: '#8fa5ff',
    objective: 'TRACE THE FULL CAREER PATH',
    plate: '5-experience',
  },
  {
    id: 'achievements',
    label: 'ACHIEVEMENTS',
    Icon: Trophy,
    accent: '#ff2e63',
    accentHi: '#ff6f93',
    objective: 'COLLECT EVERY UNLOCKED TROPHY',
    plate: '6-achievements',
  },
  {
    id: 'academy',
    label: 'ACADEMY',
    Icon: GraduationCap,
    accent: '#ffb43d',
    accentHi: '#ffcd7a',
    objective: 'SHARE WHAT THE JOURNEY TAUGHT',
    plate: '7-academy',
  },
  {
    id: 'contact',
    label: 'CONTACT',
    Icon: Mail,
    accent: '#3dd6ff',
    accentHi: '#84e6ff',
    objective: 'OPEN A SECURE LINE OF CONTACT',
    plate: '8-contact',
  },
  {
    id: 'exit',
    label: 'EXIT GAME',
    Icon: Power,
    accent: '#ff9e6b',
    accentHi: '#ffc0a0',
    objective: 'RIDE OFF INTO THE SUNRISE',
    plate: '9-exit',
  },
]

export const screenIds = screens.map((s) => s.id)

export const DEFAULT_SCREEN_ID = 'start'

export function getScreen(id) {
  return screens.find((s) => s.id === id)
}
```

- [ ] **Step 4: Run and confirm pass**

Run: `npm test`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/data/screens.js src/data/screens.test.js
git commit -m "feat: add the nine-screen configuration"
```

---

### Task 3: Hash routing

**Files:**
- Create: `src/state/useHashRoute.js`, `src/state/useHashRoute.test.jsx`

**Interfaces:**
- Consumes: `screenIds`, `DEFAULT_SCREEN_ID` from Task 2.
- Produces: `useHashRoute()` returning `[screenId, setScreenId]`. Unknown or absent hashes resolve to `DEFAULT_SCREEN_ID`. `setScreenId(id)` writes `#/id`.

- [ ] **Step 1: Write the failing tests**

`src/state/useHashRoute.test.jsx`:

```jsx
import { describe, it, expect, act } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useHashRoute } from './useHashRoute'

describe('useHashRoute', () => {
  it('defaults to the start screen when the hash is empty', () => {
    const { result } = renderHook(() => useHashRoute())
    expect(result.current[0]).toBe('start')
  })

  it('reads a valid hash', () => {
    window.location.hash = '#/skills'
    const { result } = renderHook(() => useHashRoute())
    expect(result.current[0]).toBe('skills')
  })

  it('falls back to the start screen for an unknown hash', () => {
    window.location.hash = '#/nonsense'
    const { result } = renderHook(() => useHashRoute())
    expect(result.current[0]).toBe('start')
  })

  it('writes the hash when the screen is set', () => {
    const { result } = renderHook(() => useHashRoute())
    act(() => result.current[1]('contact'))
    expect(window.location.hash).toBe('#/contact')
    expect(result.current[0]).toBe('contact')
  })

  it('responds to browser navigation', () => {
    const { result } = renderHook(() => useHashRoute())
    act(() => {
      window.location.hash = '#/experience'
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    })
    expect(result.current[0]).toBe('experience')
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test src/state/useHashRoute.test.jsx`
Expected: FAIL — cannot resolve `./useHashRoute`.

- [ ] **Step 3: Implement the hook**

`src/state/useHashRoute.js`:

```js
import { useCallback, useEffect, useState } from 'react'
import { DEFAULT_SCREEN_ID, screenIds } from '../data/screens'

function readHash() {
  const id = window.location.hash.replace(/^#\/?/, '')
  return screenIds.includes(id) ? id : DEFAULT_SCREEN_ID
}

/**
 * Screen selection lives in the URL so every screen is linkable, shareable
 * and reachable with the browser back button.
 */
export function useHashRoute() {
  const [screenId, setState] = useState(readHash)

  useEffect(() => {
    const onChange = () => setState(readHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const setScreenId = useCallback((id) => {
    if (!screenIds.includes(id)) return
    window.location.hash = `#/${id}`
    setState(id)
  }, [])

  return [screenId, setScreenId]
}
```

- [ ] **Step 4: Run and confirm pass**

Run: `npm test src/state/useHashRoute.test.jsx`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/state/useHashRoute.js src/state/useHashRoute.test.jsx
git commit -m "feat: add hash routing for screens"
```

---

### Task 4: Progress state

**Files:**
- Create: `src/state/useProgress.js`, `src/state/useProgress.test.jsx`

**Interfaces:**
- Produces: `useProgress()` returning `{ visited, visit, isVisited, stars, shipped, ratio, reset }`. `visited` is a `Set` of screen ids. `visit(id)` returns `true` when that id was newly added and `false` when it was already there, so the caller knows whether to fire a toast. `stars` is 0–5, `shipped` counts toward 67, `ratio` is 0–1.
- Storage key: `kj.visited.v1`.

- [ ] **Step 1: Write the failing tests**

`src/state/useProgress.test.jsx`:

```jsx
import { describe, it, expect, vi, act } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useProgress, STORAGE_KEY } from './useProgress'

describe('useProgress', () => {
  it('starts with nothing visited', () => {
    const { result } = renderHook(() => useProgress())
    expect(result.current.visited.size).toBe(0)
    expect(result.current.stars).toBe(0)
    expect(result.current.shipped).toBe(0)
  })

  it('reports a first visit as new and a repeat visit as not new', () => {
    const { result } = renderHook(() => useProgress())
    let first, second
    act(() => { first = result.current.visit('about') })
    act(() => { second = result.current.visit('about') })
    expect(first).toBe(true)
    expect(second).toBe(false)
    expect(result.current.visited.size).toBe(1)
  })

  it('awards all five stars and the full count when every screen is visited', () => {
    const { result } = renderHook(() => useProgress())
    act(() => {
      for (const id of ['start', 'about', 'skills', 'projects', 'experience',
        'achievements', 'academy', 'contact', 'exit']) result.current.visit(id)
    })
    expect(result.current.stars).toBe(5)
    expect(result.current.shipped).toBe(67)
    expect(result.current.ratio).toBe(1)
  })

  it('persists across mounts', () => {
    const first = renderHook(() => useProgress())
    act(() => { first.result.current.visit('skills') })
    first.unmount()
    const second = renderHook(() => useProgress())
    expect(second.result.current.isVisited('skills')).toBe(true)
  })

  it('survives storage being unavailable', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied')
    })
    const { result } = renderHook(() => useProgress())
    expect(result.current.visited.size).toBe(0)
    spy.mockRestore()
  })

  it('ignores junk in storage', () => {
    window.localStorage.setItem(STORAGE_KEY, 'not json')
    const { result } = renderHook(() => useProgress())
    expect(result.current.visited.size).toBe(0)
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test src/state/useProgress.test.jsx`
Expected: FAIL — cannot resolve `./useProgress`.

- [ ] **Step 3: Implement the hook**

`src/state/useProgress.js`:

```js
import { useCallback, useMemo, useState } from 'react'
import { screenIds } from '../data/screens'

export const STORAGE_KEY = 'kj.visited.v1'

const TOTAL_SHIPPED = 67
const TOTAL_STARS = 5

/** Private browsing and blocked site data both throw here, so every access is guarded. */
function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((id) => screenIds.includes(id)))
  } catch {
    return new Set()
  }
}

function save(visited) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]))
  } catch {
    // A viewer with storage disabled still gets a working site, just no memory.
  }
}

export function useProgress() {
  const [visited, setVisited] = useState(load)

  const visit = useCallback((id) => {
    if (!screenIds.includes(id)) return false
    let isNew = false
    setVisited((prev) => {
      if (prev.has(id)) return prev
      isNew = true
      const next = new Set(prev)
      next.add(id)
      save(next)
      return next
    })
    return isNew
  }, [])

  const reset = useCallback(() => {
    setVisited(new Set())
    save(new Set())
  }, [])

  return useMemo(() => {
    const ratio = visited.size / screenIds.length
    return {
      visited,
      visit,
      reset,
      isVisited: (id) => visited.has(id),
      ratio,
      stars: Math.round(ratio * TOTAL_STARS),
      shipped: Math.round(ratio * TOTAL_SHIPPED),
    }
  }, [visited, visit, reset])
}
```

Note on `visit`: the `isNew` flag is assigned inside the updater, which React may invoke twice under StrictMode. The guard `if (prev.has(id)) return prev` makes the second invocation a no-op, so the flag stays correct.

- [ ] **Step 4: Run and confirm pass**

Run: `npm test src/state/useProgress.test.jsx`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/state/useProgress.js src/state/useProgress.test.jsx
git commit -m "feat: add visited-screen progress state"
```

---

### Task 5: Theme layer and fonts

**Files:**
- Modify: `src/index.css`, `index.html`
- Create: `public/fonts/` (downloaded woff2 files)

**Interfaces:**
- Produces: CSS custom properties `--accent`, `--accent-hi`, `--accent-soft` set per screen by a `[data-screen="<id>"]` selector on `<html>`; `--ink`, `--bone`, `--muted`; the `--fs-wordmark`, `--fs-screen`, `--fs-hud` type scale; `.scrim-left` and `.scrim-bottom` utility classes; font families `--font-display` (Anton), `--font-script` (Kaushan Script), `--font-body` (Inter), `--font-mono` (JetBrains Mono).

- [ ] **Step 1: Download and self-host the two new faces**

```bash
mkdir -p public/fonts
curl -sL "https://fonts.gstatic.com/s/anton/v25/1Ptgg87LROyAm3K9-C8CSKlv.woff2" -o public/fonts/anton-latin.woff2
curl -sL "https://fonts.gstatic.com/s/kaushanscript/v18/vm8vdRfvXFLG3OLnsO15WYS5DG74wNc.woff2" -o public/fonts/kaushan-script-latin.woff2
ls -la public/fonts
```

Both files should be present and non-empty. If either URL 404s, open `https://fonts.googleapis.com/css2?family=Anton&family=Kaushan+Script&display=swap` in a browser with a modern user agent, copy the `src: url(...)` value for the `latin` subset, and use that URL instead.

- [ ] **Step 2: Replace the `@theme` block in `src/index.css`**

Replace the entire existing `@theme { ... }` block with:

```css
@theme {
  --color-ink-950: #05050a;
  --color-ink-900: #0a0a12;
  --color-ink-800: #12121c;
  --color-ink-700: #1b1b29;
  --color-bone: #f5f5f7;
  --color-muted: #8d8da3;
  --color-mint-500: #00d68a;

  --font-display: 'Anton', 'Arial Narrow', sans-serif;
  --font-script: 'Kaushan Script', cursive;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-fluid-sm: clamp(0.875rem, 0.83rem + 0.22vw, 1rem);
  --text-fluid-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-fluid-lg: clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem);

  --container-content: 72rem;
}
```

- [ ] **Step 3: Replace the `:root` token block with the accent system**

Replace the existing `:root { ... }` design-token block with:

```css
@font-face {
  font-family: 'Anton';
  src: url('/fonts/anton-latin.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: 'Kaushan Script';
  src: url('/fonts/kaushan-script-latin.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}

:root {
  --ink: #05050a;
  --bone: #f5f5f7;
  --muted: #8d8da3;

  /* Overridden per screen below. Start-screen values are the defaults so a
     first paint before hydration already looks right. */
  --accent: #ff3e88;
  --accent-hi: #ff7ab0;
  --accent-soft: color-mix(in srgb, var(--accent) 12%, transparent);

  --fs-wordmark: clamp(2.5rem, 1.2rem + 6.5vw, 7rem);
  --fs-screen: clamp(1.75rem, 1.1rem + 3.4vw, 4rem);
  --fs-hud: clamp(0.625rem, 0.6rem + 0.2vw, 0.8125rem);

  --gutter: clamp(1rem, 0.6rem + 2vw, 2.5rem);
  --hud-pad: clamp(0.75rem, 0.5rem + 1.2vw, 1.5rem);

  /* One transition covers every accent-driven property. */
  --accent-transition: 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

[data-screen='start']        { --accent: #ff3e88; --accent-hi: #ff7ab0; }
[data-screen='about']        { --accent: #ff8a3d; --accent-hi: #ffad74; }
[data-screen='skills']       { --accent: #7c6cff; --accent-hi: #a79bff; }
[data-screen='projects']     { --accent: #19c8ff; --accent-hi: #6bdcff; }
[data-screen='experience']   { --accent: #5b7cff; --accent-hi: #8fa5ff; }
[data-screen='achievements'] { --accent: #ff2e63; --accent-hi: #ff6f93; }
[data-screen='academy']      { --accent: #ffb43d; --accent-hi: #ffcd7a; }
[data-screen='contact']      { --accent: #3dd6ff; --accent-hi: #84e6ff; }
[data-screen='exit']         { --accent: #ff9e6b; --accent-hi: #ffc0a0; }
```

- [ ] **Step 4: Add the scrim utilities**

Append to the `@layer components` block in `src/index.css`:

```css
  /* The menu sits over the left third of every plate. Several plates are busy
     there, so the scrim is a guarantee of contrast rather than a nicety. */
  .scrim-left {
    background: linear-gradient(
      90deg,
      rgb(5 5 10 / 0.92) 0%,
      rgb(5 5 10 / 0.78) 28%,
      rgb(5 5 10 / 0.35) 52%,
      transparent 78%
    );
  }

  .scrim-bottom {
    background: linear-gradient(
      0deg,
      rgb(5 5 10 / 0.88) 0%,
      rgb(5 5 10 / 0.45) 40%,
      transparent 100%
    );
  }

  .wordmark {
    font-family: var(--font-display);
    font-size: var(--fs-wordmark);
    line-height: 0.84;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    transform: skewX(-8deg);
    transform-origin: left bottom;
    color: var(--bone);
    text-shadow: 0 6px 24px rgb(0 0 0 / 0.55);
  }

  .script-sub {
    font-family: var(--font-script);
    color: var(--accent);
    transition: color var(--accent-transition);
  }

  .hud-label {
    font-family: var(--font-mono);
    font-size: var(--fs-hud);
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
  }
```

- [ ] **Step 5: Update the font link in `index.html`**

Replace the Google Fonts `<link href="https://fonts.googleapis.com/css2?family=Sora...">` line with one that drops Sora and keeps Inter and JetBrains Mono, and add preloads for the two self-hosted faces:

```html
    <link rel="preload" href="/fonts/anton-latin.woff2" as="font" type="font/woff2" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

- [ ] **Step 6: Verify the build still compiles and the tokens emit**

```bash
npm run build
CSS=$(ls dist/assets/*.css)
grep -c "data-screen='achievements'\|data-screen=\"achievements\"" $CSS
grep -o "\.wordmark{[^}]*}" $CSS
```

Expected: build succeeds; both greps return a match.

- [ ] **Step 7: Commit**

```bash
git add src/index.css index.html public/fonts
git commit -m "feat: add per-screen accent tokens and self-hosted display faces"
```

---

### Task 6: Plate image pipeline

**Files:**
- Create: `scripts/build-plates.mjs`
- Modify: `package.json`, `.gitignore`

**Interfaces:**
- Produces: for each source `reference/plates-source/<n>-<name>.png`, the files `public/plates/<n>-<name>-{960,1440,1672}.{avif,webp}`. Run with `npm run plates`.

- [ ] **Step 1: Install sharp as a dev dependency**

```bash
npm install -D sharp
```

- [ ] **Step 2: Write the script**

`scripts/build-plates.mjs`:

```js
/**
 * Converts the source plate PNGs into responsive AVIF and WebP.
 *
 * Sources live in reference/plates-source/ and are gitignored — they are
 * roughly 2MB each. Only the converted output is committed.
 *
 * Run: npm run plates
 */
import { mkdir, readdir, stat } from 'node:fs/promises'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const SRC = 'reference/plates-source'
const OUT = 'public/plates'
const WIDTHS = [960, 1440, 1672]
const BUDGET_KB = 200

await mkdir(OUT, { recursive: true })

const files = (await readdir(SRC)).filter((f) => f.endsWith('.png')).sort()
if (files.length === 0) {
  console.error(`No PNGs found in ${SRC}`)
  process.exit(1)
}

let worst = 0

for (const file of files) {
  const { name } = parse(file)
  for (const width of WIDTHS) {
    const base = sharp(join(SRC, file)).resize({ width, withoutEnlargement: true })

    const avifPath = join(OUT, `${name}-${width}.avif`)
    await base.clone().avif({ quality: 52, effort: 6 }).toFile(avifPath)

    const webpPath = join(OUT, `${name}-${width}.webp`)
    await base.clone().webp({ quality: 76 }).toFile(webpPath)

    for (const p of [avifPath, webpPath]) {
      const kb = Math.round((await stat(p)).size / 1024)
      worst = Math.max(worst, kb)
      const flag = kb > BUDGET_KB ? ' OVER BUDGET' : ''
      console.log(`${String(kb).padStart(4)}KB  ${p}${flag}`)
    }
  }
}

console.log(`\nLargest output: ${worst}KB (budget ${BUDGET_KB}KB)`)
if (worst > BUDGET_KB) {
  console.error('At least one plate is over budget — lower the quality settings.')
  process.exit(1)
}
```

- [ ] **Step 3: Add the script to `package.json`**

```json
    "plates": "node scripts/build-plates.mjs"
```

- [ ] **Step 4: Run it and confirm every output is within budget**

Run: `npm run plates`
Expected: 54 files written (9 plates × 3 widths × 2 formats), final line reports a largest output at or under 200KB. If it exits non-zero, drop `avif.quality` to 45 and `webp.quality` to 70 and run again.

- [ ] **Step 5: Confirm the converted plates are committed but the sources are not**

```bash
git status --short public/plates | head -5
git check-ignore -v reference/plates-source/1-start.png
```

Expected: `public/plates` files show as untracked additions; `reference/plates-source` is reported as ignored.

- [ ] **Step 6: Commit**

```bash
git add scripts/build-plates.mjs package.json package-lock.json public/plates
git commit -m "build: add responsive plate conversion pipeline"
```

---

### Task 7: Plate component

**Files:**
- Create: `src/components/Plate.jsx`, `src/components/Plate.test.jsx`

**Interfaces:**
- Consumes: nothing from earlier tasks beyond the plate naming convention from Task 6.
- Produces: `<Plate plate="1-start" alt="…" accent="#ff3e88" priority={false} />`. Renders a `<picture>` with AVIF and WebP `srcSet` at 960w/1440w/1672w, sized `100vw`. Until the image decodes, an accent gradient fills the frame, so there is never an empty box and the site is presentable with no plates at all.

- [ ] **Step 1: Write the failing tests**

`src/components/Plate.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
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
    const { container } = render(<Plate plate="9-exit" alt="Exit" accent="#ff9e6b" />)
    const fallback = container.querySelector('[data-testid="plate-fallback"]')
    expect(fallback).toBeInTheDocument()
    expect(fallback.style.background).toContain('#ff9e6b')
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
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test src/components/Plate.test.jsx`
Expected: FAIL — cannot resolve `./Plate`.

- [ ] **Step 3: Implement the component**

`src/components/Plate.jsx`:

```jsx
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
          fetchpriority={priority ? 'high' : 'auto'}
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
```

The explicit `width` and `height` give the browser the intrinsic ratio before the file arrives, which is what holds CLS at zero.

- [ ] **Step 4: Run and confirm pass**

Run: `npm test src/components/Plate.test.jsx`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/Plate.jsx src/components/Plate.test.jsx
git commit -m "feat: add the art plate component with gradient fallback"
```

---

### Task 8: Menu

**Files:**
- Create: `src/components/menu/MenuItem.jsx`, `src/components/menu/Menu.jsx`, `src/components/menu/Menu.test.jsx`

**Interfaces:**
- Consumes: `screens` from Task 2.
- Produces: `<Menu activeId="start" isVisited={(id) => boolean} onSelect={(id) => void} />`. Renders `role="tablist"` with `aria-orientation="vertical"`; each item is `role="tab"` with `aria-selected` and `id="tab-<screenId>"`, controlling `panel-<screenId>`. Roving tabindex: only the active tab is focusable. ArrowDown/ArrowUp move and select with wraparound; Home and End jump to the ends.

- [ ] **Step 1: Write the failing tests**

`src/components/menu/Menu.test.jsx`:

```jsx
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
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test src/components/menu/Menu.test.jsx`
Expected: FAIL — cannot resolve `./Menu`.

- [ ] **Step 3: Implement `MenuItem`**

`src/components/menu/MenuItem.jsx`:

```jsx
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
```

- [ ] **Step 4: Implement `Menu`**

`src/components/menu/Menu.jsx`:

```jsx
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
```

- [ ] **Step 5: Run and confirm pass**

Run: `npm test src/components/menu/Menu.test.jsx`
Expected: PASS, 8 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/menu
git commit -m "feat: add the keyboard-navigable pause menu"
```

---

### Task 9: HUD

**Files:**
- Create: `src/components/hud/Clock.jsx`, `Stars.jsx`, `ShippedCounter.jsx`, `Minimap.jsx`, `Objective.jsx`, `KeyHints.jsx`, `JourneyBar.jsx`, `RadioStrip.jsx`, `Hud.jsx`, `Hud.test.jsx`

**Interfaces:**
- Consumes: `stars`, `shipped`, `ratio` from Task 4; the active screen's `objective` from Task 2.
- Produces: `<Hud objective="…" stars={3} shipped={40} ratio={0.55} />`. Decorative parts carry `aria-hidden`; the objective is exposed as real text.

- [ ] **Step 1: Write the failing tests**

`src/components/hud/Hud.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hud from './Hud'

describe('Hud', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-20T18:56:00'))
  })
  afterEach(() => vi.useRealTimers())

  it('shows the current objective as readable text', () => {
    render(<Hud objective="REVIEW UNLOCKED ABILITIES" stars={2} shipped={15} ratio={0.22} />)
    expect(screen.getByText('REVIEW UNLOCKED ABILITIES')).toBeInTheDocument()
  })

  it('shows the local time at minute resolution', () => {
    render(<Hud objective="X" stars={0} shipped={0} ratio={0} />)
    expect(screen.getByText('18:56')).toBeInTheDocument()
  })

  it('shows the shipped count', () => {
    render(<Hud objective="X" stars={3} shipped={40} ratio={0.6} />)
    expect(screen.getByText(/40/)).toBeInTheDocument()
  })

  it('renders five stars with the earned ones marked', () => {
    const { container } = render(
      <Hud objective="X" stars={3} shipped={40} ratio={0.6} />,
    )
    const all = container.querySelectorAll('[data-star]')
    expect(all).toHaveLength(5)
    expect(container.querySelectorAll('[data-star="on"]')).toHaveLength(3)
  })

  it('hides decoration from assistive technology', () => {
    const { container } = render(
      <Hud objective="X" stars={1} shipped={7} ratio={0.11} />,
    )
    expect(container.querySelector('[data-testid="radio"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    expect(container.querySelector('[data-testid="minimap"]')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test src/components/hud/Hud.test.jsx`
Expected: FAIL — cannot resolve `./Hud`.

- [ ] **Step 3: Implement the leaf components**

`src/components/hud/Clock.jsx`:

```jsx
import { useEffect, useState } from 'react'

function hhmm(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

/** Minute resolution on purpose — a per-second tick would re-render the HUD 60× more often for no gain. */
export default function Clock() {
  const [now, setNow] = useState(() => hhmm(new Date()))

  useEffect(() => {
    const id = setInterval(() => setNow(hhmm(new Date())), 15000)
    return () => clearInterval(id)
  }, [])

  return <span className="font-mono text-[13px] tabular-nums text-bone">{now}</span>
}
```

`src/components/hud/Stars.jsx`:

```jsx
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
```

`src/components/hud/ShippedCounter.jsx`:

```jsx
export default function ShippedCounter({ shipped }) {
  return (
    <span className="font-mono text-[11px] tracking-[0.16em] text-[var(--accent)]">
      {shipped} SHIPPED
    </span>
  )
}
```

`src/components/hud/Minimap.jsx`:

```jsx
/** Decorative progress plot. The marker rides a diagonal as screens are visited. */
export default function Minimap({ ratio }) {
  const x = 6 + ratio * 52
  const y = 40 - ratio * 30

  return (
    <svg
      data-testid="minimap"
      aria-hidden="true"
      viewBox="0 0 64 46"
      className="h-12 w-16 rounded-md border border-bone/10 bg-ink-950/60"
    >
      {[10, 20, 30].map((gy) => (
        <line key={gy} x1="0" y1={gy} x2="64" y2={gy} stroke="currentColor" strokeWidth="0.4" className="text-bone/10" />
      ))}
      {[16, 32, 48].map((gx) => (
        <line key={gx} x1={gx} y1="0" x2={gx} y2="46" stroke="currentColor" strokeWidth="0.4" className="text-bone/10" />
      ))}
      <path d="M6 40 L58 10" stroke="var(--accent)" strokeWidth="1.2" fill="none" opacity="0.7" />
      <circle cx={x} cy={y} r="3" fill="var(--accent)" />
    </svg>
  )
}
```

`src/components/hud/Objective.jsx`:

```jsx
export default function Objective({ objective }) {
  return (
    <div className="min-w-0">
      <p className="hud-label">Current objective</p>
      <p className="font-display max-w-[22ch] text-[clamp(0.9rem,0.8rem+0.5vw,1.25rem)] uppercase leading-[1.1] tracking-wide text-bone">
        {objective}
      </p>
    </div>
  )
}
```

`src/components/hud/KeyHints.jsx`:

```jsx
const KEYS = [
  ['Ent', 'Select'],
  ['↑↓', 'Navigate'],
  ['Esc', 'Start'],
]

export default function KeyHints() {
  return (
    <div aria-hidden className="hidden items-center gap-4 sm:flex">
      {KEYS.map(([key, label]) => (
        <span key={key} className="flex items-center gap-1.5">
          <kbd className="rounded border border-bone/20 bg-ink-950/70 px-1.5 py-0.5 font-mono text-[10px] text-bone/80">
            {key}
          </kbd>
          <span className="hud-label">{label}</span>
        </span>
      ))}
    </div>
  )
}
```

`src/components/hud/JourneyBar.jsx`:

```jsx
export default function JourneyBar({ ratio }) {
  return (
    <div aria-hidden className="flex items-center gap-3">
      <span className="hud-label whitespace-nowrap">A developer&apos;s journey continues</span>
      <span className="h-[2px] w-24 overflow-hidden rounded-full bg-bone/15 sm:w-40">
        <span
          className="block h-full rounded-full transition-[width] duration-700"
          style={{ width: `${Math.round(ratio * 100)}%`, background: 'var(--accent)' }}
        />
      </span>
    </div>
  )
}
```

`src/components/hud/RadioStrip.jsx`:

```jsx
const BARS = [0.35, 0.7, 0.45, 0.9, 0.55]

export default function RadioStrip() {
  return (
    <div
      data-testid="radio"
      aria-hidden="true"
      className="flex items-center gap-2 rounded-full border border-bone/10 bg-ink-950/60 px-3 py-1"
    >
      <span className="font-mono text-[10px] tracking-[0.2em] text-bone/70">KJ-FM 96.7</span>
      <span className="flex items-end gap-[2px]">
        {BARS.map((h, i) => (
          <span
            key={i}
            className="w-[2px] rounded-sm bg-[var(--accent)]"
            style={{ height: `${h * 12}px`, opacity: 0.45 + h * 0.5 }}
          />
        ))}
      </span>
    </div>
  )
}
```

- [ ] **Step 4: Implement `Hud`**

`src/components/hud/Hud.jsx`:

```jsx
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
 */
export default function Hud({ objective, stars, shipped, ratio }) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between p-[var(--hud-pad)]">
        <div className="hidden sm:block">
          <RadioStrip />
        </div>
        <p aria-hidden className="hud-label hidden text-right leading-[1.6] md:block">
          Discipline
          <br />
          creates
          <br />
          freedom
        </p>
        <div className="flex flex-col items-end gap-1 sm:hidden">
          <Clock />
          <Stars stars={stars} />
        </div>
      </div>

      <div className="pointer-events-none absolute right-0 top-0 z-30 hidden flex-col items-end gap-1 p-[var(--hud-pad)] sm:flex">
        <Clock />
        <Stars stars={stars} />
        <ShippedCounter shipped={shipped} />
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
```

The top-right block is duplicated for small screens deliberately: under `sm` the clock and stars move into the top bar and the shipped counter is dropped, which is the 320px reduction the device matrix requires.

- [ ] **Step 5: Run and confirm pass**

Run: `npm test src/components/hud/Hud.test.jsx`
Expected: PASS, 5 tests.

- [ ] **Step 6: Commit**

```bash
git add src/components/hud
git commit -m "feat: add the persistent HUD"
```

---

### Task 10: Ambient motion, sprites and the app shell

**Files:**
- Create: `src/state/useAmbientMotion.js`, `src/components/PlateFX.jsx`, `src/components/Sprites.jsx`, `src/components/Toast.jsx`, `src/components/Splash.jsx`, `src/App.test.jsx`
- Modify: `src/App.jsx`, `src/main.jsx`, `src/index.css`

**Interfaces:**
- Consumes: `useHashRoute` (Task 3), `useProgress` (Task 4), `Plate` (Task 7), `Menu` (Task 8), `Hud` (Task 9).
- Produces: `useAmbientMotion()` returning a boolean. `<PlateFX enabled />`, `<Sprites screenId="skills" enabled />`, `<Toast message="…" onDone={fn} />`, `<Splash done={bool} />`. `App` renders one `role="tabpanel"` with `id="panel-<screenId>"` and `aria-labelledby="tab-<screenId>"`, sets `data-screen` on `<html>`, and announces screen changes in a polite live region.

- [ ] **Step 1: Write the failing tests**

`src/App.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('opens on the start screen', async () => {
    render(<App />)
    await waitFor(() =>
      expect(document.documentElement).toHaveAttribute('data-screen', 'start'),
    )
  })

  it('switches screens and retints the document', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /skills/i }))
    await waitFor(() =>
      expect(document.documentElement).toHaveAttribute('data-screen', 'skills'),
    )
    expect(window.location.hash).toBe('#/skills')
  })

  it('exposes the active screen as a labelled tabpanel', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /contact/i }))
    const panel = await screen.findByRole('tabpanel')
    expect(panel).toHaveAttribute('id', 'panel-contact')
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-contact')
  })

  it('marks a screen visited once opened', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /achievements/i }))
    await waitFor(() =>
      expect(screen.getByRole('tab', { name: /achievements/i })).toHaveAttribute(
        'data-visited',
        'true',
      ),
    )
  })

  it('announces the new screen politely', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /experience/i }))
    const live = document.querySelector('[aria-live="polite"]')
    await waitFor(() => expect(live).toHaveTextContent(/experience/i))
  })

  it('returns to the start screen on Escape', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /projects/i }))
    await user.keyboard('{Escape}')
    await waitFor(() =>
      expect(document.documentElement).toHaveAttribute('data-screen', 'start'),
    )
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test src/App.test.jsx`
Expected: FAIL — `App` still renders the old section layout, so no tablist exists.

- [ ] **Step 3: Implement the motion gate**

`src/state/useAmbientMotion.js`:

```js
import { useEffect, useState } from 'react'

/**
 * Single decision point for whether decorative motion may run. Everything
 * ambient asks this rather than checking media queries independently, so the
 * answer can never disagree between two components.
 */
export function useAmbientMotion() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const saveData = navigator.connection?.saveData === true

    const update = () => setEnabled(!query.matches && !saveData)
    update()

    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return enabled
}
```

- [ ] **Step 4: Implement the ambient layer**

`src/components/PlateFX.jsx`:

```jsx
/**
 * Ambient layer over a plate: drift, grain, light sweep, neon pulse.
 * Pure CSS — the classes are defined in index.css so nothing animates in JS.
 */
export default function PlateFX({ enabled }) {
  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10">
      <div className="fx-grain absolute inset-0" />
      <div className="fx-sweep absolute inset-0" />
      <div className="fx-neon absolute inset-0" />
    </div>
  )
}
```

Append to `src/index.css`, outside `@layer components`:

```css
/* ============================================================
   PLATE AMBIENT LAYER — transforms and opacity only
   ============================================================ */
.fx-drift {
  animation: fxDrift 40s ease-in-out infinite alternate;
  will-change: transform;
}

@keyframes fxDrift {
  from { transform: scale(1.03) translate3d(0, 0, 0); }
  to   { transform: scale(1.06) translate3d(-1.2%, -0.8%, 0); }
}

.fx-grain {
  opacity: 0.16;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E");
  animation: fxGrain 0.9s steps(3) infinite;
}

@keyframes fxGrain {
  0%   { transform: translate3d(0, 0, 0); }
  33%  { transform: translate3d(-2%, 1%, 0); }
  66%  { transform: translate3d(1%, -2%, 0); }
  100% { transform: translate3d(0, 0, 0); }
}

.fx-sweep {
  background: linear-gradient(105deg, transparent 38%, rgb(255 255 255 / 0.05) 50%, transparent 62%);
  animation: fxSweep 9s ease-in-out infinite;
  will-change: transform;
}

@keyframes fxSweep {
  0%, 70%, 100% { transform: translate3d(-60%, 0, 0); }
  35%           { transform: translate3d(60%, 0, 0); }
}

.fx-neon {
  background: radial-gradient(60% 40% at 78% 34%, var(--accent) 0%, transparent 60%);
  opacity: 0.1;
  animation: fxNeon 4.5s ease-in-out infinite;
}

@keyframes fxNeon {
  0%, 100% { opacity: 0.08; }
  42%      { opacity: 0.16; }
  46%      { opacity: 0.06; }
  52%      { opacity: 0.15; }
}

.fx-steam {
  background: radial-gradient(closest-side, rgb(255 255 255 / 0.5), transparent);
  filter: blur(6px);
  animation: fxSteam 5.5s ease-in-out infinite;
  will-change: transform, opacity;
}

@keyframes fxSteam {
  0%   { opacity: 0; transform: translate3d(0, 6%, 0) scale(0.8); }
  25%  { opacity: 0.5; }
  100% { opacity: 0; transform: translate3d(-18%, -70%, 0) scale(1.5); }
}

.fx-heli {
  animation: fxHeli 26s linear infinite;
  will-change: transform;
}

@keyframes fxHeli {
  from { transform: translate3d(-8vw, 0, 0); }
  to   { transform: translate3d(70vw, -4vh, 0); }
}

.fx-twinkle {
  animation: fxTwinkle 3.2s ease-in-out infinite;
}

@keyframes fxTwinkle {
  0%, 100% { opacity: 0.25; }
  50%      { opacity: 0.75; }
}

@media (prefers-reduced-motion: reduce) {
  .fx-drift, .fx-grain, .fx-sweep, .fx-neon,
  .fx-steam, .fx-heli, .fx-twinkle {
    animation: none;
  }
}
```

- [ ] **Step 5: Implement the sprite layer**

`src/components/Sprites.jsx`:

```jsx
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
```

- [ ] **Step 6: Implement the toast and splash**

`src/components/Toast.jsx`:

```jsx
import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'

export default function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return undefined
    const id = setTimeout(onDone, 2400)
    return () => clearTimeout(id)
  }, [message, onDone])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute left-1/2 top-[15%] z-40 -translate-x-1/2"
        >
          <p className="font-display whitespace-nowrap text-[clamp(1.1rem,0.9rem+1.2vw,2rem)] uppercase italic tracking-wide text-[var(--accent)] drop-shadow-[0_2px_18px_rgba(0,0,0,0.6)]">
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

`src/components/Splash.jsx`:

```jsx
import { AnimatePresence, motion } from 'motion/react'

export default function Splash({ done }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-ink-950"
        >
          <p className="wordmark text-center">
            Kishan
            <br />
            Jaiswal
          </p>
          <span className="h-[3px] w-40 overflow-hidden rounded-full bg-bone/15">
            <span className="block h-full w-1/3 animate-[fxSweep_1.4s_ease-in-out_infinite] rounded-full bg-[var(--accent)]" />
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 7: Rewrite `App.jsx`**

```jsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { DEFAULT_SCREEN_ID, getScreen } from './data/screens'
import { useHashRoute } from './state/useHashRoute'
import { useProgress } from './state/useProgress'
import { useAmbientMotion } from './state/useAmbientMotion'
import Menu from './components/menu/Menu'
import Hud from './components/hud/Hud'
import Plate from './components/Plate'
import PlateFX from './components/PlateFX'
import Sprites from './components/Sprites'
import Toast from './components/Toast'
import Splash from './components/Splash'
import ScreenBody from './components/screens/ScreenBody'
import PlainView from './components/PlainView'

export default function App() {
  const [screenId, setScreenId] = useHashRoute()
  const { visit, isVisited, stars, shipped, ratio } = useProgress()
  const ambient = useAmbientMotion()
  const [toast, setToast] = useState('')
  const [ready, setReady] = useState(false)
  const [plain, setPlain] = useState(false)
  const panelRef = useRef(null)

  const screen = getScreen(screenId) ?? getScreen(DEFAULT_SCREEN_ID)

  // The document carries the active screen so CSS, not JavaScript, retints.
  useEffect(() => {
    document.documentElement.setAttribute('data-screen', screen.id)
  }, [screen.id])

  useEffect(() => {
    if (visit(screen.id)) setToast('Mission passed')
  }, [screen.id, visit])

  useEffect(() => {
    const id = setTimeout(() => setReady(true), 350)
    return () => clearTimeout(id)
  }, [])

  // Focus the panel heading on change so keyboard and screen-reader users
  // land on the new content rather than staying in the menu.
  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true })
  }, [screen.id])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !plain) setScreenId(DEFAULT_SCREEN_ID)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setScreenId, plain])

  const clearToast = useCallback(() => setToast(''), [])

  if (plain) return <PlainView onClose={() => setPlain(false)} />

  return (
    <>
      <a href="#panel" className="skip-link">
        Skip to content
      </a>

      <Splash done={ready} />

      <main
        id="main"
        className="relative h-[100svh] w-full overflow-hidden bg-ink-950"
      >
        <AnimatePresence mode="popLayout">
          <motion.div
            key={screen.id}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: ambient ? 0.42 : 0, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <div className={ambient ? 'fx-drift absolute inset-0' : 'absolute inset-0'}>
              <Plate
                plate={screen.plate}
                alt=""
                accent={screen.accent}
                priority={screen.id === DEFAULT_SCREEN_ID}
              />
            </div>
            <PlateFX enabled={ambient} />
            <Sprites screenId={screen.id} enabled={ambient} />
          </motion.div>
        </AnimatePresence>

        <div className="scrim-left pointer-events-none absolute inset-y-0 left-0 z-20 w-full sm:w-2/3 lg:w-1/2" />

        <div className="absolute inset-0 z-20 flex flex-col">
          <div className="flex min-h-0 flex-1 flex-col gap-4 px-[var(--gutter)] pb-28 pt-16 sm:pt-20 lg:flex-row lg:gap-10">
            <div className="w-full shrink-0 lg:w-[min(30vw,22rem)]">
              <p className="wordmark mb-1">
                Kishan
                <br />
                Jaiswal
              </p>
              <p className="script-sub mb-5 -mt-1 pl-1 text-[clamp(1.1rem,0.9rem+1vw,1.9rem)]">
                Portfolio
              </p>
              <Menu activeId={screen.id} isVisited={isVisited} onSelect={setScreenId} />
              <button
                type="button"
                onClick={() => setPlain(true)}
                className="tap mt-4 w-full justify-start px-3 font-mono text-[11px] tracking-[0.16em] text-bone/55 underline decoration-dotted underline-offset-4 hover:text-bone"
              >
                PLAIN RÉSUMÉ VIEW
              </button>
            </div>

            <div
              id="panel"
              ref={panelRef}
              role="tabpanel"
              tabIndex={-1}
              aria-labelledby={`tab-${screen.id}`}
              className="min-h-0 flex-1 overflow-y-auto pb-4 outline-none"
            >
              <ScreenBody screenId={screen.id} />
            </div>
          </div>
        </div>

        <Hud objective={screen.objective} stars={stars} shipped={shipped} ratio={ratio} />
        <Toast message={toast} onDone={clearToast} />

        <p aria-live="polite" className="sr-only">
          {screen.label} screen
        </p>
      </main>
    </>
  )
}
```

- [ ] **Step 8: Add a temporary `ScreenBody` so the shell runs**

`src/components/screens/ScreenBody.jsx`:

```jsx
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
```

- [ ] **Step 9: Add a stub `PlainView` so the import resolves**

`src/components/PlainView.jsx`:

```jsx
/** Filled in Task 14. */
export default function PlainView({ onClose }) {
  return (
    <main className="mx-auto max-w-content px-5 py-12">
      <button type="button" onClick={onClose} className="tap font-mono text-xs underline">
        BACK TO THE MENU
      </button>
      <h1 className="mt-6 font-display text-4xl uppercase text-bone">Kishan Jaiswal</h1>
    </main>
  )
}
```

- [ ] **Step 10: Add the `sr-only` helper to `src/index.css`**

Inside `@layer components`:

```css
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
    border: 0;
  }
```

- [ ] **Step 11: Run the tests and the build**

```bash
npm test
npm run build
```

Expected: all tests pass; build succeeds.

- [ ] **Step 12: Commit**

```bash
git add src
git commit -m "feat: add the pause-menu app shell with ambient motion"
```

---

### Task 11: Start, About and Skills screens

**Files:**
- Create: `src/components/screens/StartScreen.jsx`, `AboutScreen.jsx`, `SkillsScreen.jsx`, `src/components/screens/screens.test.jsx`
- Modify: `src/components/screens/ScreenBody.jsx`, `src/data/portfolio.js`

**Interfaces:**
- Consumes: `stats`, `experience` from `src/data/portfolio.js`.
- Produces: `capabilities` exported from `src/data/portfolio.js` — an array of `{ label, unit, value, fill }` where `fill` is 0–1. `ScreenBody` dispatches `start`, `about` and `skills` to real components.

- [ ] **Step 1: Write the failing tests**

`src/components/screens/screens.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ScreenBody from './ScreenBody'

describe('screen bodies', () => {
  it('shows the real headline stats on the start screen', () => {
    render(<ScreenBody screenId="start" />)
    expect(screen.getByText('67')).toBeInTheDocument()
    expect(screen.getByText(/casino games/i)).toBeInTheDocument()
    expect(screen.getByText('15')).toBeInTheDocument()
  })

  it('shows availability and both disciplines on the start screen', () => {
    render(<ScreenBody screenId="start" />)
    expect(screen.getByText(/open to opportunities/i)).toBeInTheDocument()
    expect(screen.getByText(/games people play/i)).toBeInTheDocument()
  })

  it('lists location, role and experience rows on the about screen', () => {
    render(<ScreenBody screenId="about" />)
    expect(screen.getByText(/experience/i)).toBeInTheDocument()
    expect(screen.getByText(/unity developer/i)).toBeInTheDocument()
    expect(screen.getByText(/bilions/i)).toBeInTheDocument()
  })

  it('measures every skill bar in a real unit, never a percentage', () => {
    render(<ScreenBody screenId="skills" />)
    const units = screen.getAllByTestId('capability-unit')
    expect(units.length).toBeGreaterThan(4)
    for (const el of units) {
      expect(el.textContent).not.toMatch(/%/)
    }
  })

  it('gives each capability bar an accessible value', () => {
    render(<ScreenBody screenId="skills" />)
    const bars = screen.getAllByRole('img', { name: /unity|slot|team|multiplayer/i })
    expect(bars.length).toBeGreaterThan(2)
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test src/components/screens/screens.test.jsx`
Expected: FAIL — the stub `ScreenBody` renders only a label.

- [ ] **Step 3: Add the capabilities data**

Append to `src/data/portfolio.js`:

```js
/**
 * Capability bars for the Skills screen.
 *
 * Every bar is measured in a real, checkable unit. Self-assigned percentages
 * are deliberately absent — they read as a junior signal and none of these
 * numbers needs one.
 */
export const capabilities = [
  { label: 'Unity Engine', unit: '5 YRS', fill: 1 },
  { label: 'Casino & Slot Mechanics', unit: '67 TITLES', fill: 1 },
  { label: 'Built From Scratch', unit: '30+ GAMES', fill: 0.85 },
  { label: 'Team Leadership', unit: '15 DEVS', fill: 0.8 },
  { label: 'Multiplayer & Realtime', unit: 'PHOTON · SOCKET.IO', fill: 0.75 },
  { label: 'Web & Product', unit: 'REACT · NODE · TS', fill: 0.6 },
  { label: 'Cross-Platform Delivery', unit: 'WEBGL · ANDROID · IOS', fill: 0.8 },
]
```

- [ ] **Step 4: Implement `StartScreen`**

```jsx
import { ArrowRight, FileText } from 'lucide-react'
import { stats } from '../../data/portfolio'

export default function StartScreen() {
  return (
    <div className="max-w-xl">
      <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-mint-500" />
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent-hi)]">
          Open to opportunities
        </span>
      </p>

      <h1 className="font-display mb-4 text-[var(--fs-screen)] uppercase italic leading-[0.92] text-bone">
        Real-time systems
        <br />
        engineer
      </h1>

      <p className="mb-7 text-fluid-base leading-relaxed text-bone/75">
        Games people play, and the products behind them. Five years shipping
        production game systems — currently building a 67-game casino platform
        with Stack Engine and RGS integration.
      </p>

      <dl className="mb-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-bone/50">
              {s.label === 'Casino Games' ? 'Casino games' : s.label}
            </dt>
            <dd className="font-display text-[clamp(1.75rem,1.2rem+2.4vw,3.25rem)] leading-none text-[var(--accent-hi)]">
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-3">
        <a
          href="#/projects"
          className="tap gap-2 rounded-lg px-5 py-3 font-mono text-[12px] font-bold tracking-[0.12em] text-ink-950"
          style={{ background: 'var(--accent)' }}
        >
          SEE THE WORK <ArrowRight size={15} />
        </a>
        <a
          href="/assets/resume.pdf"
          download
          className="tap gap-2 rounded-lg border border-bone/20 bg-ink-950/50 px-5 py-3 font-mono text-[12px] tracking-[0.12em] text-bone"
        >
          <FileText size={15} /> RESUME
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Implement `AboutScreen`**

```jsx
import { experience } from '../../data/portfolio'

const ROWS = [
  { label: 'Experience', value: '5+ years · since 2021' },
  { label: 'Location', value: 'India · working remotely' },
  { label: 'Current role', value: 'Unity Developer, Bilions (Austin, TX)' },
  { label: 'Status', value: 'Open to opportunities' },
]

export default function AboutScreen() {
  const current = experience.find((e) => e.current)

  return (
    <div className="max-w-xl">
      <h1 className="font-display mb-1 text-[var(--fs-screen)] uppercase italic leading-none text-bone">
        About
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">Me</p>

      <p className="mb-7 text-fluid-base leading-relaxed text-bone/75">
        I build the systems players never see — the mechanics, the state
        synchronisation, the delivery pipelines that let 67 games live on one
        platform. Five years in production, from leading a team of 15 across
        50+ projects to architecting slot games from scratch.
      </p>

      <dl className="mb-7 space-y-2.5">
        {ROWS.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline gap-4 rounded-lg border border-bone/10 bg-ink-950/50 px-3.5 py-2.5"
          >
            <dt className="w-28 shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-bone/50">
              {row.label}
            </dt>
            <dd className="min-w-0 text-sm text-bone">{row.value}</dd>
          </div>
        ))}
      </dl>

      {current && (
        <p className="border-l-2 pl-4 text-sm leading-relaxed text-bone/70" style={{ borderColor: 'var(--accent)' }}>
          {current.desc}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 6: Implement `SkillsScreen`**

```jsx
import { capabilities } from '../../data/portfolio'

const SEGMENTS = 12

export default function SkillsScreen() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display mb-1 text-[var(--fs-screen)] uppercase italic leading-none text-bone">
        Skills
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">Unlocked</p>

      <ul className="space-y-3.5">
        {capabilities.map((cap) => {
          const filled = Math.round(cap.fill * SEGMENTS)
          return (
            <li key={cap.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-bone">
                  {cap.label}
                </span>
                <span
                  data-testid="capability-unit"
                  className="font-mono text-[10px] tracking-[0.12em] text-[var(--accent-hi)]"
                >
                  {cap.unit}
                </span>
              </div>
              <span
                role="img"
                aria-label={`${cap.label}: ${cap.unit}`}
                className="flex gap-[3px]"
              >
                {Array.from({ length: SEGMENTS }, (_, i) => (
                  <span
                    key={i}
                    className="h-[6px] flex-1 rounded-[1px]"
                    style={{
                      background: i < filled ? 'var(--accent)' : 'rgb(245 245 247 / 0.12)',
                    }}
                  />
                ))}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
```

- [ ] **Step 7: Wire them into `ScreenBody`**

```jsx
import { getScreen } from '../../data/screens'
import StartScreen from './StartScreen'
import AboutScreen from './AboutScreen'
import SkillsScreen from './SkillsScreen'

const BODIES = {
  start: StartScreen,
  about: AboutScreen,
  skills: SkillsScreen,
}

export default function ScreenBody({ screenId }) {
  const Body = BODIES[screenId]
  if (Body) return <Body />

  const screen = getScreen(screenId)
  return (
    <h1 className="font-display text-[var(--fs-screen)] uppercase italic leading-none text-bone">
      {screen.label}
    </h1>
  )
}
```

- [ ] **Step 8: Run and confirm pass**

Run: `npm test src/components/screens/screens.test.jsx`
Expected: PASS, 5 tests.

- [ ] **Step 9: Commit**

```bash
git add src/components/screens src/data/portfolio.js
git commit -m "feat: add the start, about and skills screens"
```

---

### Task 12: Projects, Experience and Achievements screens

**Files:**
- Create: `src/components/screens/ProjectsScreen.jsx`, `ExperienceScreen.jsx`, `AchievementsScreen.jsx`, `src/components/screens/projects.test.jsx`
- Modify: `src/components/screens/ScreenBody.jsx`, `src/data/portfolio.js`

**Interfaces:**
- Consumes: `projects`, `experience`, `caseStudies` from `src/data/portfolio.js`; `CaseStudyModal` as it already exists.
- Produces: `webProjects` and `achievements` exported from `src/data/portfolio.js`. `webProjects` entries are `{ title, desc, stack, status }` where `status` is `'locked'` or `'live'`; locked entries render as "IN DEVELOPMENT" and are not links.

- [ ] **Step 1: Write the failing tests**

`src/components/screens/projects.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScreenBody from './ScreenBody'

describe('projects screen', () => {
  it('splits work into casino ops and web ops', () => {
    render(<ScreenBody screenId="projects" />)
    expect(screen.getByText(/casino ops/i)).toBeInTheDocument()
    expect(screen.getByText(/web ops/i)).toBeInTheDocument()
  })

  it('lists the flagship casino mission', () => {
    render(<ScreenBody screenId="projects" />)
    expect(screen.getByText(/slot empire/i)).toBeInTheDocument()
  })

  it('renders locked web missions as non-links marked in development', () => {
    render(<ScreenBody screenId="projects" />)
    const locked = screen.getAllByTestId('mission-locked')
    expect(locked.length).toBeGreaterThan(0)
    for (const el of locked) {
      expect(el.tagName).not.toBe('A')
      expect(el).toHaveTextContent(/in development/i)
    }
  })

  it('opens a case study from a flagship mission', async () => {
    const user = userEvent.setup()
    render(<ScreenBody screenId="projects" />)
    await user.click(screen.getAllByRole('button', { name: /case file/i })[0])
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })
})

describe('experience screen', () => {
  it('pins the current role', () => {
    render(<ScreenBody screenId="experience" />)
    expect(screen.getByTestId('current-role')).toHaveTextContent(/bilions/i)
  })

  it('lists every past role', () => {
    render(<ScreenBody screenId="experience" />)
    expect(screen.getByText(/phibonacci/i)).toBeInTheDocument()
    expect(screen.getByText(/outscal/i)).toBeInTheDocument()
  })
})

describe('achievements screen', () => {
  it('lists trophies with real metrics', () => {
    render(<ScreenBody screenId="achievements" />)
    expect(screen.getByText(/67 casino games/i)).toBeInTheDocument()
    expect(screen.getByText(/best project award/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test src/components/screens/projects.test.jsx`
Expected: FAIL — `ScreenBody` still falls through to the label for these ids.

- [ ] **Step 3: Add the web missions and achievements data**

Append to `src/data/portfolio.js`:

```js
/**
 * Web Ops missions. Locked entries are a designed state, not a gap — a game
 * menu can show something not yet unlocked without looking broken, which a
 * conventional portfolio cannot.
 *
 * Move an entry to status 'live' and add url/repo once it ships.
 */
export const webProjects = [
  {
    title: 'Realtime Slot Dashboard',
    desc: 'Operator-facing live view of sessions, RTP and jackpot state over WebSockets.',
    stack: ['React', 'Node', 'Socket.IO'],
    status: 'locked',
  },
  {
    title: 'Game Config Studio',
    desc: 'Browser tool for authoring and validating slot configurations without a Unity build.',
    stack: ['React', 'TypeScript', 'Node'],
    status: 'locked',
  },
  {
    title: 'This Portfolio',
    desc: 'Nine-screen pause-menu interface. React 19, Vite, Tailwind 4, no framework beyond that.',
    stack: ['React', 'Vite', 'Tailwind'],
    status: 'live',
    repo: 'https://github.com/kishan831/kishan831.github.io',
  },
]

export const achievements = [
  { title: '67 casino games shipped', desc: 'One platform, shared infrastructure, Addressables delivery.' },
  { title: '30+ games built from scratch', desc: 'Architected end to end within the Slot Empire platform.' },
  { title: 'Led 15 developers', desc: 'Across 50+ projects at PhiBonacci Solutions.' },
  { title: 'Best Project Award 2021', desc: 'Government Polytechnic Shahjahanpur, Diploma in C.S.E.' },
  { title: 'Stack Engine & RGS integration', desc: 'Server-driven game logic for web-playable deployment.' },
]
```

- [ ] **Step 4: Implement `ProjectsScreen`**

```jsx
import { useState } from 'react'
import { Play, Lock, ExternalLink } from 'lucide-react'
import { Github } from '../BrandIcons'
import { projects, webProjects, caseStudies } from '../../data/portfolio'
import CaseStudyModal from '../CaseStudyModal'

function Strand({ title, count, children }) {
  return (
    <section className="mb-7">
      <div className="mb-3 flex items-baseline gap-3">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent-hi)]">
          {title}
        </h2>
        <span className="h-px flex-1 bg-bone/15" />
        <span className="font-mono text-[10px] text-bone/40">{count}</span>
      </div>
      <ul className="space-y-1.5">{children}</ul>
    </section>
  )
}

function Row({ children }) {
  return (
    <li className="rounded-lg border border-bone/10 bg-ink-950/55 px-3.5 py-2.5 transition-colors hover:border-[var(--accent)]/40">
      {children}
    </li>
  )
}

export default function ProjectsScreen() {
  const [openCaseId, setOpenCaseId] = useState(null)
  const study = openCaseId ? caseStudies[openCaseId] : null

  return (
    <div className="max-w-xl">
      <h1 className="font-display mb-1 text-[var(--fs-screen)] uppercase italic leading-none text-bone">
        Projects
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">Missions</p>

      <Strand title="Casino Ops" count={`${projects.length} missions`}>
        {projects.map((p) => (
          <Row key={p.title}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-[var(--accent)]">
                {p.type === 'github' ? <Github size={14} /> : <Play size={14} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-bone">{p.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-bone/60">{p.desc}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {p.vid && (
                    <a
                      href={`https://www.youtube.com/watch?v=${p.vid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] tracking-[0.14em] text-[var(--accent-hi)] underline underline-offset-4"
                    >
                      WATCH
                    </a>
                  )}
                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] tracking-[0.14em] text-[var(--accent-hi)] underline underline-offset-4"
                    >
                      CODE
                    </a>
                  )}
                  {p.caseId && (
                    <button
                      type="button"
                      onClick={() => setOpenCaseId(p.caseId)}
                      className="font-mono text-[10px] tracking-[0.14em] text-bone/70 underline underline-offset-4 hover:text-bone"
                    >
                      CASE FILE
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Row>
        ))}
      </Strand>

      <Strand title="Web Ops" count={`${webProjects.length} missions`}>
        {webProjects.map((w) =>
          w.status === 'locked' ? (
            <li
              key={w.title}
              data-testid="mission-locked"
              className="rounded-lg border border-dashed border-bone/15 bg-ink-950/40 px-3.5 py-2.5"
            >
              <div className="flex items-start gap-3">
                <Lock size={14} className="mt-0.5 shrink-0 text-bone/35" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-bone/55">{w.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-bone/40">{w.desc}</p>
                  <p className="mt-1.5 font-mono text-[10px] tracking-[0.16em] text-bone/35">
                    IN DEVELOPMENT · {w.stack.join(' · ')}
                  </p>
                </div>
              </div>
            </li>
          ) : (
            <Row key={w.title}>
              <div className="flex items-start gap-3">
                <ExternalLink size={14} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-bone">{w.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-bone/60">{w.desc}</p>
                  <a
                    href={w.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block font-mono text-[10px] tracking-[0.14em] text-[var(--accent-hi)] underline underline-offset-4"
                  >
                    CODE
                  </a>
                </div>
              </div>
            </Row>
          ),
        )}
      </Strand>

      <CaseStudyModal study={study} onClose={() => setOpenCaseId(null)} />
    </div>
  )
}
```

- [ ] **Step 5: Implement `ExperienceScreen`**

```jsx
import { experience } from '../../data/portfolio'

export default function ExperienceScreen() {
  const current = experience.find((e) => e.current)
  const rest = experience.filter((e) => !e.current)

  return (
    <div className="max-w-xl">
      <h1 className="font-display mb-1 text-[var(--fs-screen)] uppercase italic leading-none text-bone">
        Experience
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">Journey</p>

      {current && (
        <div
          data-testid="current-role"
          className="mb-5 rounded-lg border-l-2 bg-ink-950/60 px-4 py-3"
          style={{ borderColor: 'var(--accent)' }}
        >
          <p className="font-mono text-[10px] tracking-[0.18em] text-[var(--accent-hi)]">
            {current.date}
          </p>
          <p className="mt-1 text-sm font-semibold text-bone">{current.role}</p>
          <p className="text-xs text-bone/60">{current.org}</p>
        </div>
      )}

      <ol className="relative space-y-4 border-l border-bone/15 pl-5">
        {rest.map((e) => (
          <li key={`${e.date}-${e.role}`} className="relative">
            <span className="absolute -left-[1.6rem] top-1.5 h-2 w-2 rounded-full bg-bone/30" />
            <p className="font-mono text-[10px] tracking-[0.18em] text-bone/45">{e.date}</p>
            <p className="mt-0.5 text-sm font-semibold text-bone">{e.role}</p>
            <p className="text-xs text-bone/60">{e.org}</p>
            {e.desc && (
              <p className="mt-1.5 text-xs leading-relaxed text-bone/50">{e.desc}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
```

- [ ] **Step 6: Implement `AchievementsScreen`**

```jsx
import { Trophy } from 'lucide-react'
import { achievements } from '../../data/portfolio'

export default function AchievementsScreen() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display mb-1 text-[var(--fs-screen)] uppercase italic leading-none text-bone">
        Achievements
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">Unlocked</p>

      <ul className="space-y-2">
        {achievements.map((a) => (
          <li
            key={a.title}
            className="flex items-start gap-3 rounded-lg border border-bone/10 bg-ink-950/55 px-3.5 py-3"
          >
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
              style={{ background: 'var(--accent-soft)' }}
            >
              <Trophy size={14} className="text-[var(--accent)]" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-bone">{a.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-bone/60">{a.desc}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 7: Register them in `ScreenBody`**

Add the three imports and extend `BODIES`:

```jsx
  projects: ProjectsScreen,
  experience: ExperienceScreen,
  achievements: AchievementsScreen,
```

- [ ] **Step 8: Run and confirm pass**

Run: `npm test src/components/screens/projects.test.jsx`
Expected: PASS, 7 tests.

- [ ] **Step 9: Commit**

```bash
git add src/components/screens src/data/portfolio.js
git commit -m "feat: add the projects, experience and achievements screens"
```

---

### Task 13: Academy, Contact and Exit screens

**Files:**
- Create: `src/components/screens/AcademyScreen.jsx`, `ContactScreen.jsx`, `ExitScreen.jsx`, `src/components/screens/contact.test.jsx`
- Modify: `src/components/screens/ScreenBody.jsx`, `src/data/portfolio.js`

**Interfaces:**
- Consumes: `socials`, `skillGroups`, `FORMSPREE_ACTION` from `src/data/portfolio.js`.
- Produces: `ContactScreen` posts to `FORMSPREE_ACTION` when it is a non-empty string, and otherwise falls back to a `mailto:` link built from the field values. Required fields are name, email and message.

- [ ] **Step 1: Write the failing tests**

`src/components/screens/contact.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScreenBody from './ScreenBody'

describe('contact screen', () => {
  it('shows the direct channels', () => {
    render(<ScreenBody screenId="contact" />)
    expect(screen.getByText(/jaiswalkishan628@gmail.com/i)).toBeInTheDocument()
  })

  it('requires name, email and message', () => {
    render(<ScreenBody screenId="contact" />)
    expect(screen.getByLabelText(/name/i)).toBeRequired()
    expect(screen.getByLabelText(/email/i)).toBeRequired()
    expect(screen.getByLabelText(/message/i)).toBeRequired()
  })

  it('shows a validation summary when submitted empty', async () => {
    const user = userEvent.setup()
    render(<ScreenBody screenId="contact" />)
    await user.click(screen.getByRole('button', { name: /send/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/name/i)
  })
})

describe('academy screen', () => {
  it('lists the tech stack groups', () => {
    render(<ScreenBody screenId="academy" />)
    expect(screen.getByText(/casino & gameplay/i)).toBeInTheDocument()
  })
})

describe('exit screen', () => {
  it('says mission complete and offers the resume', () => {
    render(<ScreenBody screenId="exit" />)
    expect(screen.getByText(/mission complete/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /resume/i })).toHaveAttribute(
      'href',
      '/assets/resume.pdf',
    )
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test src/components/screens/contact.test.jsx`
Expected: FAIL — these ids still fall through to the label.

- [ ] **Step 3: Implement `AcademyScreen`**

```jsx
import { skillGroups } from '../../data/portfolio'

export default function AcademyScreen() {
  return (
    <div className="max-w-xl">
      <h1 className="font-display mb-1 text-[var(--fs-screen)] uppercase italic leading-none text-bone">
        Academy
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">Loadout</p>

      <p className="mb-6 text-sm leading-relaxed text-bone/70">
        Five years of production work, distilled. These are the tools I reach
        for and the patterns I lean on — the things I would teach someone
        starting out.
      </p>

      <div className="space-y-4">
        {skillGroups.map(({ Icon, title, tags }) => (
          <section key={title}>
            <h2 className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent-hi)]">
              <Icon size={14} aria-hidden />
              {title}
            </h2>
            <ul className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <li
                  key={t}
                  className="rounded border border-bone/10 bg-ink-950/50 px-2 py-1 font-mono text-[10px] text-bone/75"
                >
                  {t}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Implement `ContactScreen`**

```jsx
import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import { Github, Linkedin, Youtube } from '../BrandIcons'
import { socials, FORMSPREE_ACTION } from '../../data/portfolio'

const CHANNELS = [
  { Icon: Mail, label: 'Email', value: socials.email, href: `mailto:${socials.email}` },
  { Icon: Linkedin, label: 'LinkedIn', value: '/in/kishan-jaiswal', href: socials.linkedin },
  { Icon: Github, label: 'GitHub', value: '/kishan831', href: socials.github },
  { Icon: Youtube, label: 'YouTube', value: 'Gameplay demos', href: socials.youtube },
]

const FIELD_CLASS =
  'w-full rounded-lg border border-bone/15 bg-ink-950/60 px-3.5 py-2.5 text-sm text-bone placeholder:text-bone/35 focus:border-[var(--accent)] focus:outline-hidden'

export default function ContactScreen() {
  const [errors, setErrors] = useState([])
  const [sent, setSent] = useState(false)

  function onSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const message = String(data.get('message') || '').trim()

    const found = []
    if (!name) found.push('Name is required.')
    if (!email) found.push('Email is required.')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) found.push('Email looks invalid.')
    if (!message) found.push('Message is required.')

    setErrors(found)
    if (found.length > 0) return

    if (FORMSPREE_ACTION) {
      event.currentTarget.submit()
      return
    }

    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`)
    window.location.href = `mailto:${socials.email}?subject=${encodeURIComponent(
      `Portfolio enquiry from ${name}`,
    )}&body=${body}`
    setSent(true)
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display mb-1 text-[var(--fs-screen)] uppercase italic leading-none text-bone">
        Contact
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">Let&apos;s connect</p>

      <ul className="mb-6 space-y-1.5">
        {CHANNELS.map(({ Icon, label, value, href }) => (
          <li key={label}>
            <a
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="tap w-full justify-start gap-3 rounded-lg border border-bone/10 bg-ink-950/55 px-3.5 py-2.5 hover:border-[var(--accent)]/40"
            >
              <Icon size={14} className="shrink-0 text-[var(--accent)]" aria-hidden />
              <span className="min-w-0">
                <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-bone/45">
                  {label}
                </span>
                <span className="block truncate text-sm text-bone">{value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      {errors.length > 0 && (
        <ul role="alert" className="mb-3 space-y-1 rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2.5">
          {errors.map((e) => (
            <li key={e} className="text-xs text-red-200">
              {e}
            </li>
          ))}
        </ul>
      )}

      {sent && (
        <p className="mb-3 rounded-lg border border-mint-500/40 bg-mint-500/10 px-3.5 py-2.5 text-xs text-mint-500">
          Your mail client should be opening. If it did not, write to {socials.email}.
        </p>
      )}

      <form
        onSubmit={onSubmit}
        action={FORMSPREE_ACTION || undefined}
        method={FORMSPREE_ACTION ? 'POST' : undefined}
        noValidate
        className="space-y-2.5"
      >
        <div>
          <label htmlFor="name" className="mb-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-bone/50">
            Name
          </label>
          <input id="name" name="name" required className={FIELD_CLASS} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-bone/50">
            Email
          </label>
          <input id="email" name="email" type="email" required className={FIELD_CLASS} placeholder="you@company.com" />
        </div>
        <div>
          <label htmlFor="message" className="mb-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-bone/50">
            Message
          </label>
          <textarea id="message" name="message" rows={4} required className={`${FIELD_CLASS} resize-none`} placeholder="What are you building?" />
        </div>
        <button
          type="submit"
          className="tap gap-2 rounded-lg px-5 py-3 font-mono text-[12px] font-bold tracking-[0.12em] text-ink-950"
          style={{ background: 'var(--accent)' }}
        >
          <Send size={14} /> SEND MESSAGE
        </button>
      </form>
    </div>
  )
}
```

- [ ] **Step 5: Implement `ExitScreen`**

```jsx
import { FileText, RotateCcw } from 'lucide-react'
import { socials } from '../../data/portfolio'

export default function ExitScreen() {
  return (
    <div className="max-w-xl">
      <p className="hud-label mb-2">Thank you for visiting</p>
      <h1 className="font-display mb-1 text-[var(--fs-screen)] uppercase italic leading-[0.92] text-bone">
        Mission
        <br />
        complete
      </h1>
      <p className="script-sub mb-6 text-[clamp(1rem,0.9rem+0.8vw,1.6rem)]">See you soon</p>

      <p className="mb-7 text-fluid-base leading-relaxed text-bone/75">
        That is the whole run. If any of it looks like the kind of engineer your
        team is missing, the line is open.
      </p>

      <div className="flex flex-wrap gap-3">
        <a
          href="/assets/resume.pdf"
          download
          className="tap gap-2 rounded-lg px-5 py-3 font-mono text-[12px] font-bold tracking-[0.12em] text-ink-950"
          style={{ background: 'var(--accent)' }}
        >
          <FileText size={15} /> RESUME
        </a>
        <a
          href={`mailto:${socials.email}`}
          className="tap gap-2 rounded-lg border border-bone/20 bg-ink-950/50 px-5 py-3 font-mono text-[12px] tracking-[0.12em] text-bone"
        >
          GET IN TOUCH
        </a>
        <a
          href="#/start"
          className="tap gap-2 rounded-lg border border-bone/20 bg-ink-950/50 px-5 py-3 font-mono text-[12px] tracking-[0.12em] text-bone"
        >
          <RotateCcw size={15} /> BACK TO START
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Register them in `ScreenBody`**

Extend `BODIES` with `academy`, `contact` and `exit`, and delete the fallback branch — all nine ids are now mapped:

```jsx
export default function ScreenBody({ screenId }) {
  const Body = BODIES[screenId] ?? StartScreen
  return <Body />
}
```

- [ ] **Step 7: Run the whole suite and confirm pass**

Run: `npm test`
Expected: PASS across all files.

- [ ] **Step 8: Commit**

```bash
git add src/components/screens
git commit -m "feat: add the academy, contact and exit screens"
```

---

### Task 14: Plain résumé view

**Files:**
- Modify: `src/components/PlainView.jsx`
- Create: `src/components/PlainView.test.jsx`

**Interfaces:**
- Consumes: every exported dataset in `src/data/portfolio.js`.
- Produces: `<PlainView onClose={fn} />` — one scrolling document containing all nine screens' content, using real headings, no plates and no HUD.

- [ ] **Step 1: Write the failing tests**

`src/components/PlainView.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PlainView from './PlainView'

describe('PlainView', () => {
  it('has one h1 and a heading per section', () => {
    render(<PlainView onClose={() => {}} />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const h2s = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(h2s).toEqual(
      expect.arrayContaining(['About', 'Skills', 'Projects', 'Experience', 'Achievements', 'Contact']),
    )
  })

  it('contains the headline numbers a recruiter is scanning for', () => {
    render(<PlainView onClose={() => {}} />)
    expect(screen.getByText(/67/)).toBeInTheDocument()
    expect(screen.getByText(/bilions/i)).toBeInTheDocument()
  })

  it('lists every project including the locked web missions', () => {
    render(<PlainView onClose={() => {}} />)
    expect(screen.getByText(/slot empire/i)).toBeInTheDocument()
    expect(screen.getByText(/realtime slot dashboard/i)).toBeInTheDocument()
  })

  it('returns to the menu', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<PlainView onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: /menu/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test src/components/PlainView.test.jsx`
Expected: FAIL — the stub has no section headings.

- [ ] **Step 3: Implement the view**

`src/components/PlainView.jsx`:

```jsx
import {
  stats, capabilities, experience, projects, webProjects, achievements, socials,
} from '../data/portfolio'

function Section({ title, children }) {
  return (
    <section className="mt-9">
      <h2 className="mb-3 border-b border-bone/15 pb-1.5 font-display text-2xl uppercase tracking-wide text-bone">
        {title}
      </h2>
      {children}
    </section>
  )
}

/**
 * The same content as the nine screens, as one conventional document.
 *
 * This is not a fallback — it is the surface a recruiter with ten seconds
 * uses, and the one that prints. The game interface is the other way in.
 */
export default function PlainView({ onClose }) {
  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <button
        type="button"
        onClick={onClose}
        className="tap mb-8 justify-start font-mono text-[11px] tracking-[0.16em] text-bone/60 underline decoration-dotted underline-offset-4 hover:text-bone"
      >
        ← BACK TO THE MENU
      </button>

      <h1 className="font-display text-4xl uppercase leading-none text-bone">Kishan Jaiswal</h1>
      <p className="mt-2 text-sm text-bone/70">
        Real-time systems engineer — Unity, C#, React, Node. India, working remotely.
      </p>
      <p className="mt-1 text-sm text-bone/70">
        <a className="underline underline-offset-4" href={`mailto:${socials.email}`}>{socials.email}</a>
        {' · '}
        <a className="underline underline-offset-4" href={socials.github}>GitHub</a>
        {' · '}
        <a className="underline underline-offset-4" href={socials.linkedin}>LinkedIn</a>
        {' · '}
        <a className="underline underline-offset-4" href="/assets/resume.pdf" download>Résumé (PDF)</a>
      </p>

      <Section title="About">
        <p className="text-sm leading-relaxed text-bone/80">
          I build the systems players never see — mechanics, state
          synchronisation, and the delivery pipelines that let 67 games live on
          one platform. Five years in production, from leading a team of 15
          across 50+ projects to architecting slot games from scratch.
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-bone/70">
          {stats.map((s) => (
            <li key={s.label}>
              <strong className="text-bone">{s.value}</strong> {s.label}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Skills">
        <ul className="space-y-1 text-sm text-bone/80">
          {capabilities.map((c) => (
            <li key={c.label}>
              <strong className="text-bone">{c.label}</strong> — {c.unit}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Projects">
        <ul className="space-y-2.5 text-sm">
          {[...projects, ...webProjects].map((p) => (
            <li key={p.title}>
              <p className="font-semibold text-bone">
                {p.title}
                {p.status === 'locked' && (
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-wide text-bone/45">
                    In development
                  </span>
                )}
              </p>
              <p className="text-bone/70">{p.desc}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Experience">
        <ul className="space-y-3 text-sm">
          {experience.map((e) => (
            <li key={`${e.date}-${e.role}`}>
              <p className="font-mono text-[11px] tracking-wide text-bone/50">{e.date}</p>
              <p className="font-semibold text-bone">{e.role}</p>
              <p className="text-bone/70">{e.org}</p>
              {e.desc && <p className="mt-1 text-bone/65">{e.desc}</p>}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Achievements">
        <ul className="space-y-1.5 text-sm">
          {achievements.map((a) => (
            <li key={a.title}>
              <strong className="text-bone">{a.title}</strong>
              <span className="text-bone/70"> — {a.desc}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Contact">
        <p className="text-sm text-bone/80">
          Email <a className="underline underline-offset-4" href={`mailto:${socials.email}`}>{socials.email}</a>,
          or reach me on <a className="underline underline-offset-4" href={socials.linkedin}>LinkedIn</a>.
        </p>
      </Section>
    </main>
  )
}
```

- [ ] **Step 4: Run and confirm pass**

Run: `npm test src/components/PlainView.test.jsx`
Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/PlainView.jsx src/components/PlainView.test.jsx
git commit -m "feat: add the plain resume view"
```

---

### Task 15: Responsive shell, cleanup and ship verification

**Files:**
- Modify: `src/App.jsx`, `src/index.css`, `index.html`, `public/sitemap.xml`
- Delete: `src/components/{Hero,HeroFX,Nav,About,Skills,Experience,Projects,Contact,Footer,ScrollTop,primitives}.jsx`

**Interfaces:**
- Consumes: everything built above.
- Produces: a mobile menu sheet, swipe navigation, updated metadata, and a verified build.

- [ ] **Step 1: Delete the superseded components**

```bash
git rm src/components/Hero.jsx src/components/HeroFX.jsx src/components/Nav.jsx \
       src/components/About.jsx src/components/Skills.jsx src/components/Experience.jsx \
       src/components/Projects.jsx src/components/Contact.jsx src/components/Footer.jsx \
       src/components/ScrollTop.jsx src/components/primitives.jsx
npm run build
```

Expected: build succeeds. If it fails, something still imports a deleted file — fix the import, since nothing should.

- [ ] **Step 2: Remove the dead hero styles from `src/index.css`**

Delete the entire `HERO FX — lightweight floating casino elements` block and every `.fx-disc`, `.fx-inner`, `.fx-blur`, `.fx-coin`, `.fx-chip` rule and the `fxFloat` keyframes. Keep the new `.fx-*` rules added in Task 10 — they are different classes with the same prefix, so delete by name, not by prefix.

- [ ] **Step 3: Add the mobile menu sheet to `App.jsx`**

Add the state and the toggle. Below `lg`, the menu column becomes a bottom sheet:

```jsx
  const [menuOpen, setMenuOpen] = useState(false)
```

Replace the menu column wrapper with:

```jsx
            <div className="hidden w-full shrink-0 lg:block lg:w-[min(30vw,22rem)]">
              {/* wordmark, Menu and plain-view button, unchanged */}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="tap absolute left-[var(--gutter)] top-[calc(var(--hud-pad)+2.5rem)] z-30 gap-2 rounded-lg border border-bone/20 bg-ink-950/70 px-3.5 py-2 font-mono text-[11px] tracking-[0.16em] text-bone lg:hidden"
            >
              MENU
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'tween', duration: ambient ? 0.3 : 0, ease: [0.4, 0, 0.2, 1] }}
                  className="fixed inset-x-0 bottom-0 z-40 max-h-[80svh] overflow-y-auto rounded-t-2xl border-t border-bone/15 bg-ink-950/97 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
                >
                  <Menu
                    activeId={screen.id}
                    isVisited={isVisited}
                    onSelect={(id) => {
                      setScreenId(id)
                      setMenuOpen(false)
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="tap mt-3 w-full rounded-lg border border-bone/20 font-mono text-[11px] tracking-[0.16em] text-bone"
                  >
                    CLOSE
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
```

- [ ] **Step 4: Add swipe navigation**

Add to `App.jsx`, after the Escape handler:

```jsx
  // Horizontal swipe moves between screens on touch devices.
  useEffect(() => {
    let startX = 0
    let startY = 0

    const onStart = (e) => {
      startX = e.changedTouches[0].clientX
      startY = e.changedTouches[0].clientY
    }

    const onEnd = (e) => {
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return
      const i = screenIds.indexOf(screen.id)
      const next = dx < 0 ? i + 1 : i - 1
      if (next >= 0 && next < screenIds.length) setScreenId(screenIds[next])
    }

    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
    }
  }, [screen.id, setScreenId])
```

Add `screenIds` to the import from `./data/screens`.

- [ ] **Step 5: Update the page metadata**

In `index.html`, replace the title and the three descriptions so they match the new positioning. Use exactly:

- `<title>`: `Kishan Jaiswal — Real-Time Systems Engineer | Unity & Web`
- `meta[name=description]`, `og:description`, `twitter:description`: `Unity and web engineer with 5+ years building real-time systems — 67 casino games shipped, 30+ architected from scratch, 15 developers led.`
- `og:title` and `twitter:title`: `Kishan Jaiswal — Real-Time Systems Engineer`

Also update `public/sitemap.xml` to list the nine screen URLs:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://kishan831.github.io/</loc><priority>1.0</priority></url>
  <url><loc>https://kishan831.github.io/#/about</loc><priority>0.8</priority></url>
  <url><loc>https://kishan831.github.io/#/skills</loc><priority>0.8</priority></url>
  <url><loc>https://kishan831.github.io/#/projects</loc><priority>0.9</priority></url>
  <url><loc>https://kishan831.github.io/#/experience</loc><priority>0.8</priority></url>
  <url><loc>https://kishan831.github.io/#/achievements</loc><priority>0.7</priority></url>
  <url><loc>https://kishan831.github.io/#/academy</loc><priority>0.6</priority></url>
  <url><loc>https://kishan831.github.io/#/contact</loc><priority>0.8</priority></url>
</urlset>
```

- [ ] **Step 6: Verify the budgets**

```bash
npm test
npm run build
ls -la dist/assets/*.js dist/assets/*.css
du -sh dist
```

Expected: all tests pass. The gzip line printed by Vite for the JS bundle must be ≤180KB. If it is over, the first thing to check is whether every `lucide-react` icon import is named rather than a namespace import.

- [ ] **Step 7: Check the device matrix**

```bash
npm run dev
```

Open the served URL and check each width in browser devtools: 320, 390, 768, 1024, 1440, 1920, plus landscape 844×390. At every one of them confirm: no horizontal scrollbar, the wordmark does not clip, the menu is reachable, the objective line is readable, and the HUD does not overlap the panel content.

Then open the same URL on a real Android phone over the local network (`npm run dev -- --host`). The spec makes real-device verification a release gate, not a formality — the previous build passed devtools and still cut off on Android.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add responsive menu sheet, swipe nav, and retire the old sections"
```

- [ ] **Step 9: Merge to main and deploy**

```bash
git checkout main
git merge --no-ff chore/upgrade-stack -m "feat: rebuild the portfolio as a game pause menu"
git push origin main
```

Then watch the Actions run complete and load the live site. Confirm the Pages source is still set to "GitHub Actions" — the site cannot build otherwise.

---

## Self-Review

**Spec coverage.** §1 concept → Tasks 7–10. §2 positioning → Tasks 11–12 (`webProjects` locked entries). §3 screens → Tasks 11–13. §4 HUD → Task 9. §5.1 accents → Task 5. §5.2 typography → Task 5. §5.3 motion → Tasks 10, 15. §5.4 animation layer → Task 10 (ambient and sprites). §6 plates → Tasks 6–7. §7 technical → Tasks 1–4, 10. §8 accessibility → Tasks 8, 10, 14. §9 budgets → Tasks 6, 15. §9.1 device matrix → Task 15.

**Known gap, stated rather than hidden.** Spec §5.4 also specifies three-layer pointer parallax on the start plate. No task implements it. Cutting a foreground layer from a flat PNG needs a hand-made alpha mask, which is image work rather than code, and it is the one item that can be added later without touching any other screen. Add it as a follow-up task once the set is on the live site and the layers exist.

**Type consistency.** `visit(id)` returns a boolean everywhere. `isVisited(id)` is the predicate passed to `Menu`, never the `Set`. `plate` is a basename without extension throughout. Accent values appear in exactly two places — `screens.js` for the gradient fallback, and the `[data-screen]` rules in CSS — and the two lists match.
