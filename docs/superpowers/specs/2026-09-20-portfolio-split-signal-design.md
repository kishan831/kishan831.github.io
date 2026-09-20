# Portfolio Redesign — "Split Signal"

**Date:** 2026-09-20
**Status:** Approved design, ready for implementation planning
**Supersedes:** the Phase 2 visual pass currently on `main`

---

## 1. Problem

The site at kishan831.github.io is technically sound — mobile-safe, accessible, SEO-complete — but it reads as dull, and it tells the wrong story.

**Visual diagnosis.** Four consecutive sections share one rhythm (`Divider → Eyebrow → h2 → grid of glass cards`) and one component (`.card`, a translucent rounded-2xl box). One accent colour, mint, appears everywhere at 5–10% opacity; the `ember` palette defined in `tailwind.config.js` is effectively unused. The type scale tops out at 4rem for the hero and drops to 12px inside cards, so a portfolio of visual work reads like documentation. Every element animates with the same 28px fade-up. The hero is text-only — no face, no gameplay, nothing moving above the fold. The strongest assets (67 games, 30+ built from scratch, 15 developers led) are rendered small.

**Positioning diagnosis.** The site presents Kishan exclusively as a Unity casino/slot developer. He also works in JS/TS, React and Node, and wants that represented. This is the more serious of the two problems: the redesign has to carry a second discipline the current information architecture has no room for.

**Evidence constraint.** As of this date the public GitHub account holds 23 repositories, of which 18 are C#/Unity. The only JavaScript repository is this portfolio itself; `kishan-portfolio` (Next.js) and `gamedev-portfolio` (Vue) are forks. There is no public React/Node proof yet.

**Decision taken:** build the dual-pillar site now, design the web slots as first-class, and have Kishan ship 2–3 real React/Node projects into them. The design must make unfilled slots read as reserved rather than broken.

---

## 2. Positioning

Headline claim: **"I build real-time systems — the games people play and the products behind them."**

Two tracks, one engineer:

| Track | Label | Substance |
|---|---|---|
| Game | Game Engineering | Unity, C#, slot mechanics, RNG/RTP, Addressables, Photon Fusion, VFX |
| Product | Product Engineering | React, TypeScript, Node, Socket.IO, REST APIs, tooling |

The tracks are deliberately not framed as "day job" and "side interest". The connective tissue — real-time transport, state synchronisation, server-driven logic — is genuinely shared, and the copy leans on it.

---

## 3. Information architecture

```
Nav              logo · section links · [Game <-> Product] toggle · Contact
─────────────────────────────────────────────────────────────────────────
01 Hero          name, dual-discipline line, track toggle, stat wall,
                 headshot, ambient light shaft
02 Proof strip   Bilions · Appzia · PhiBonacci · Outscal · Upwork
03 Work          bento layout: one flagship + stat tile + cards, then a
                 horizontal rail; filtered by active track
04 Reel band     full-bleed muted gameplay video — deliberate rhythm break
05 Capabilities  two-column split keyed to track
06 Experience    sticky-rail timeline, current role pinned
07 Case studies  upgraded modal, URL-addressable
08 Contact       working form, availability, response-time line
09 Footer
```

Changes from the current build:

- `Skills` becomes `Capabilities` and is track-aware.
- `Projects` becomes `Work` and is filterable.
- Two new sections: Proof strip, Reel band.
- Standalone `About` is removed; its content folds into the Hero subhead and the Experience intro. A single dull paragraph block is not worth a section.

---

## 4. Design system

### 4.1 Colour

One dark base, with the accent swapped by a `data-track` attribute on `<html>`.

```css
:root {
  --ink-950: #05050A;
  --ink-900: #0A0A12;
  --ink-800: #12121C;
  --ink-700: #1B1B29;
  --bone:    #F5F5F7;
  --muted:   #8D8DA3;
  --mint:    #00D68A;  /* system/success only: availability dot, form success */
}

[data-track="game"] {
  --accent:      #E6B655;
  --accent-hi:   #F0C674;
  --accent-deep: #C4933D;
  --accent-soft: rgba(230, 182, 85, 0.10);
}

[data-track="product"] {
  --accent:      #21CFF3;
  --accent-hi:   #5FE3FF;
  --accent-deep: #0FA8C9;
  --accent-soft: rgba(33, 207, 243, 0.10);
}
```

Every accent usage — borders, glows, tags, buttons, focus rings — resolves through `var(--accent)`. Switching tracks is a single attribute flip; CSS transitions handle the rest. No parallel sets of Tailwind colour classes.

Both accents must meet WCAG AA (4.5:1) against `--ink-950` for body-size text and 3:1 for large text and UI borders. Verify before shipping; darken or lighten the affected token if a check fails.

### 4.2 Typography

Replace Sora as the display face. It is the default choice for developer portfolios and contributes to the generic feel.

```
Display   Bricolage Grotesque   variable, self-hosted, subset to latin
Body      Inter                 unchanged
Mono      JetBrains Mono        unchanged — labels, tags, stat numbers
```

Scale gains a real top end. The current 4rem hero ceiling is a primary cause of the flat feel.

```css
--fs-display: clamp(2.75rem, 1.2rem + 7vw, 7rem);
--fs-stat:    clamp(2.25rem, 1.2rem + 5vw, 5rem);
--fs-h2:      clamp(1.75rem, 1.2rem + 2.4vw, 3.25rem);
```

Existing `fluid-*` sizes are retained for body copy and small UI.

### 4.3 Motion

Hard constraint, carried over from the three.js removal earlier in this project: **transform and opacity only, no WebGL, no continuous JS animation loops.** All ambient motion is IntersectionObserver-gated and pauses off-screen. All motion is disabled under `prefers-reduced-motion: reduce` and under `navigator.connection.saveData`.

Three named motions, used deliberately rather than universally:

| Name | Applied to | Character |
|---|---|---|
| `settle` | game-track reveals, stat count-ups | weighted, slight overshoot, ~0.7s |
| `snap` | product-track reveals, toggle, filters | fast and precise, no bounce, ~0.3s |
| `drift` | hero ambient FX, reel parallax | slow, looping, pausable |

### 4.4 Spacing and layout

Existing `--space-section` and `--gutter` fluid tokens are kept. A 12-column grid is introduced for the bento and hero layouts; `max-w-content` (72rem) is retained as the default measure, with the Reel band and Proof strip breaking full-bleed.

---

## 5. Section specifications

### 5.1 Hero

Asymmetric two-column layout on desktop, stacked on mobile.

```
┌────────────────────────────────────────────────────────┐
│ ░░ light shaft ░░                          (coin)      │
│                                                        │
│  * available for work                  ┌────────────┐  │
│                                        │            │  │
│  I BUILD REAL-TIME                     │  headshot  │  │
│  SYSTEMS.                              │  duotone   │  │
│  ────────────────────────              │  + rim     │  │
│  Games people play, and the            └────────────┘  │
│  products behind them.                                 │
│                                                        │
│  [ Game Engineering ] [ Product Engineering ]          │
│                                                        │
│   67          30+           15          5              │
│   GAMES       FROM SCRATCH  TEAM LED    YEARS          │
│                                                        │
│  > See the work    > Resume                            │
└────────────────────────────────────────────────────────┘
```

- The stat wall is the visual anchor: `--fs-stat`, mono numerals, count-up on first paint, mono uppercase labels beneath.
- The headshot is treated as a duotone cutout with an accent rim light, so an ordinary photograph still reads as art-directed. Falls back to the existing "KJ" initials avatar if the asset is missing.
- `HeroFX` becomes track-aware: floating coins and chips on the game track; a wireframe grid with drifting data motes on the product track. Same CSS-only budget as the current implementation.
- The toggle is a real `role="tablist"` with arrow-key navigation, and it persists the choice to `localStorage`.

### 5.2 Proof strip

Full-bleed, low-height band of monochrome company marks at reduced opacity, brightening to full on hover. Leads with "Currently at Bilions". Purely a credibility beat between the hero and the work.

### 5.3 Work

Replaces the uniform three-up grid with a bento composition followed by a horizontal rail.

```
┌────────────────────────┬──────────┐
│                        │  BIG     │
│  FLAGSHIP (2x2)        │  67      │
│  Slot Empire           │  GAMES   │
│  video preview on hover├──────────┤
│                        │  card    │
├───────────┬────────────┴──────────┤
│  card     │  card                 │
└───────────┴───────────────────────┘
  <- horizontal rail: remaining titles ->
```

Game cards and web cards have deliberately different anatomies:

| | Game card | Web card |
|---|---|---|
| Media | YouTube thumbnail, hover video preview | live screenshot |
| Meta | engine, mechanics, platform tags | stack strip (React · Node · …) |
| Actions | Play · Read case study | Live · Code · Read case study |

Filtering by track is a CSS-driven reorder plus fade, not an unmount, so the layout does not jump. Unfilled product slots render as designed "In build — shipping soon" placeholders with the intended stack listed, which makes the second pillar read as reserved rather than empty.

### 5.4 Reel band

Full-bleed, muted, looping gameplay montage with a slow parallax offset, sitting between Work and Capabilities purely to break the card rhythm. `preload="none"`, poster image, `playsinline`, lazy-mounted on intersection, and replaced by a static poster under reduced-motion or save-data.

### 5.5 Capabilities

Two columns, one per track, each a weighted and scannable list rather than six identical tag-soup cards. The active track's column is emphasised; the other is present but recessed, which demonstrates range without hiding anything. Grouping follows the existing `skillGroups` data, restructured into the two tracks.

### 5.6 Experience

A sticky left rail holds the current role and total years while entries scroll past it. The Bilions entry carries an accent spine. Education collapses into a compact final row rather than occupying a full timeline entry.

### 5.7 Case studies

The existing `CaseStudyModal` is retained but made URL-addressable via a hash route (`#/case/slot-empire`), so studies are linkable and shareable. Focus trapping, `Escape` to close, and scroll locking are required. One web case study is added once the first React/Node project ships.

### 5.8 Contact

Wire the Formspree endpoint for real submission, keeping the existing mailto path as a fallback. Add an availability status line and a stated response time. Inline validation, an accessible error summary, and a success state that uses the system mint.

---

## 6. Constraints and budgets

- JavaScript ≤ 170KB gzip total.
- LCP ≤ 2.0s on simulated 4G mobile; CLS 0.
- Fonts self-hosted, latin subset, `font-display: swap`, preloaded for the display face only.
- Mobile first: the toggle becomes a segmented control, the bento collapses to one column, the rail stays swipeable with scroll-snap.
- WCAG AA contrast on both accents. The toggle, rail and modal are all keyboard operable.
- No new runtime dependencies beyond what is installed, with the possible exception of a small (≤3KB) intersection-observer helper.

**Explicitly out of scope:** WebGL or three.js in any form, custom cursors, a page-transition router, a blog, internationalisation.

---

## 7. Assets required from Kishan

| Asset | Used by | Specification |
|---|---|---|
| Clean headshot | Hero, Experience | plain or dark background, shoulders up, even lighting, 1600px+ on the short edge |
| 3–6 gameplay clips | Reel band, card hover previews | 6–10s, muted, 1080p, MP4/H.264; screen recordings are acceptable |
| Slot Empire screenshots | Case study | 3–5 images at 1920×1080 |
| Company logos | Proof strip | SVG preferred, PNG acceptable: Bilions, Appzia, PhiBonacci, Outscal, Upwork |
| Choice of 2–3 web projects | Work, Capabilities | which React/Node applications will fill the product track |
| Named testimonial (optional) | Proof strip or Contact | 1–2 sentences with name and role, from a lead or client |

The build proceeds without these; each has a designed fallback. Their absence caps how good the result can look, and the headshot and gameplay clips matter most.

---

## 8. Risks

| Risk | Mitigation |
|---|---|
| Product track stays empty, weakening the whole claim | Placeholders are designed as intentional "in build" states; if no web project is ready by the final pre-ship phase, ship single-track (game only, toggle removed) rather than publishing visible gaps, and re-enable the toggle later |
| Ambient motion regresses performance, as the three.js hero did | CSS transforms only, observer-gated, measured against the stated budgets before merge |
| Two accent colours read as inconsistent rather than intentional | A single shared base and one shared component language; only the accent variable changes |
| Bricolage Grotesque is polarising | Self-hosted and swappable via one token; the fallback is the existing Sora |

---

## 9. Next step

Turn this into a phased implementation plan (tokens and shell → hero → work → remaining sections → performance and accessibility pass → ship), with each phase independently reviewable and deployable.
