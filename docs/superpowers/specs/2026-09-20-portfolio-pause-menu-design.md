# Portfolio Redesign — "Pause Menu"

**Date:** 2026-09-20
**Status:** Approved design, ready for implementation planning
**Supersedes:** `2026-09-20-portfolio-split-signal-design.md` (same day; concept changed after Kishan shared a reference)

---

## 1. Concept

The portfolio is presented as a game pause menu. Tab-driven navigation replaces scrolling, a persistent HUD frames every screen, and each screen is a full-bleed illustrated plate that retints the entire interface to match its own art.

The reference is the `sanjai.builds` GTA VI-styled portfolio (an Astro + GSAP template). Kishan chose a close homage to that visual direction, built fresh on his own React stack.

**Why this fits him specifically.** Kishan is a Unity engineer with 67 shipped titles and five years of production game UI. A portfolio built as a game interface is a work sample for him in a way it is not for a web developer using the same idea. The craft on display — HUD layout, state feedback, progression, transitions — is literally the job.

**Asset note.** Rockstar's own fonts and artwork are not used. The display face is a free lookalike, and all nine plates are generated originals featuring Kishan. Nothing ships that is not ours.

---

## 2. Positioning

The dual-pillar positioning agreed earlier in the day is retained and expressed through the menu rather than a toggle.

Headline claim: **"I build real-time systems — the games people play and the products behind them."**

| Track | In-menu framing | Substance |
|---|---|---|
| Game | Casino Ops | Unity, C#, slot mechanics, RNG/RTP, Addressables, Photon Fusion, VFX |
| Product | Web Ops | React, TypeScript, Node, Socket.IO, REST APIs, tooling |

The Projects screen splits into these two mission strands. As of this date the web strand has no public proof — 18 of 23 public GitHub repositories are C#/Unity, the only JavaScript repository is this portfolio, and the two web-framework repositories are forks. Web missions therefore render as designed "LOCKED — IN DEVELOPMENT" entries, which reads as intentional inside a game menu in a way it never could on a conventional site. This is the one place where the concept is strictly better than the alternative.

---

## 3. Screens

Nine screens, driven by one config file. No component is edited to change content.

| # | Menu label | Content | Location watermark |
|---|---|---|---|
| 1 | START GAME | Name lockup, menu, portrait plate, availability | THE STRIP |
| 2 | ABOUT ME | Stat rows, short bio, current objective | NEON DISTRICT |
| 3 | SKILLS | Loadout: capability bars measured in real units | THE WORKSHOP |
| 4 | PROJECTS | Mission list, split Casino Ops / Web Ops | SLOT EMPIRE |
| 5 | EXPERIENCE | Career as mission history, current role pinned | BILIONS HQ |
| 6 | ACHIEVEMENTS | Trophy list with real metrics | TROPHY ROOM |
| 7 | GARAGE | Tech stack and tools as a collection screen | THE GARAGE |
| 8 | CONTACT | Phone-screen layout, working form | SAFEHOUSE |
| 9 | EXIT GAME | "MISSION COMPLETE", résumé download, back to start | SUNSET CAUSEWAY |

**Skills screen — deliberate divergence from the reference.** The reference uses self-assessed percentage bars (HTML/CSS 95%, Python 80%). Percentages invented by the candidate are widely read as a junior signal. GTA's own stat bars are canonical, so the bars stay, but each is measured in a real unit: `UNITY  5 YRS ████████`, `SLOT MECHANICS  67 TITLES ████████`, `TEAM LEADERSHIP  15 DEVS ██████`. Same visual language, verifiable numbers.

---

## 4. HUD

Persistent across all nine screens, giving separate plates one continuous identity.

```
┌────────────────────────────────────────────────────────────────┐
│                    [ KJ-FM 96.7 ▓▓▒░ ]          18:56  ★★★☆☆   │
│                                                  67 SHIPPED    │
│  KISHAN                                                        │
│  JAISWAL                                                       │
│  Portfolio                        [ full-bleed art plate ]     │
│                                                                │
│  > START GAME                                                  │
│    ABOUT ME          ✓                                         │
│    SKILLS            ✓                                         │
│    PROJECTS                                                    │
│    EXPERIENCE                                                  │
│    ACHIEVEMENTS                                                │
│    GARAGE                                                      │
│    CONTACT                                                     │
│    EXIT GAME                                                   │
│                                                                │
│  ┌────────┐  CURRENT OBJECTIVE                    THE STRIP    │
│  │minimap │  BUILD NEXT-LEVEL REAL-TIME SYSTEMS    Vice City   │
│  └────────┘                                                    │
│  [Ent] SELECT  [↑↓] NAVIGATE  [Esc] RESUME                     │
└────────────────────────────────────────────────────────────────┘
```

| Element | Behaviour |
|---|---|
| Radio strip | Static station brand with an animated level meter. Decorative. |
| Clock | Live local system time, updating each minute (not each second — no per-second re-render). |
| Progression stars | Fill as screens are visited. Five stars, nine screens, so each visit is worth more than one step. |
| Shipped counter | Counts up toward 67 as screens are visited. A real number, unlike the reference's money counter. |
| Minimap | Small animated progress plot; the marker advances with completion. |
| Current objective | One line per screen, telling the visitor what to look at. |
| Key hint bar | Keyboard hints on pointer devices, swipe hints on touch. |

Menu entries gain a checkmark once visited. Progress persists to `localStorage`, and a "MISSION PASSED" toast fires on each first visit.

---

## 5. Design system

### 5.1 Per-screen accent

Each screen declares an accent that the entire interface adopts — menu highlight, HUD glow, objective rule, watermark, toast. Implemented as a `data-screen` attribute on the root with CSS custom properties, which is a transition rather than a re-render.

```css
:root {
  --ink:   #05050A;
  --bone:  #F5F5F7;
  --muted: #8D8DA3;
  --accent: #FF3E88;      /* set per screen */
  --accent-soft: color-mix(in srgb, var(--accent) 12%, transparent);
}
```

Day-cycle palette across the nine plates, so the set reads as one journey rather than nine unrelated images:

| Screen | Time of day | Accent |
|---|---|---|
| 1 Start | sunset | `#FF3E88` hot pink |
| 2 About | morning | `#FF8A3D` orange |
| 3 Skills | overcast noon | `#7C6CFF` violet |
| 4 Projects | bright day | `#19C8FF` cyan |
| 5 Experience | blue hour | `#5B7CFF` indigo |
| 6 Achievements | night, neon | `#FF2E63` crimson |
| 7 Garage | dusk | `#FFB43D` amber |
| 8 Contact | late night | `#3DD6FF` ice |
| 9 Exit | dawn | `#FF9E6B` coral |

Every accent must clear 4.5:1 against its screen's scrim for body text and 3:1 for UI. A fixed dark scrim gradient sits under all text regions, which both guarantees contrast and stops bright plates washing the interface out.

### 5.2 Typography

```
Display   Anton, italicised via transform     heavy condensed caps — the wordmark
Script    Kaushan Script                      the accent subtitle under each title
Body      Inter                               already installed
Mono      JetBrains Mono                      HUD numerals, tags, key hints
```

Anton skewed roughly -8° closely matches the reference's heavy condensed italic wordmark, and is freely licensed. Kaushan Script covers the handwritten sub-label. Both self-hosted and subset.

```css
--fs-wordmark: clamp(3rem, 1.5rem + 8vw, 8rem);
--fs-screen:   clamp(2rem, 1.2rem + 4vw, 4.5rem);
--fs-hud:      clamp(0.625rem, 0.6rem + 0.2vw, 0.8125rem);
```

### 5.3 Motion

`motion` v13 only. GSAP is not added; nothing on the reference's feature list needs it, and it would cost roughly 70KB.

| Name | Where | Character |
|---|---|---|
| `menuSlide` | menu item focus | 120ms, accent bar wipes in from left |
| `plateCross` | screen change | 420ms cross-dissolve plus 2% scale on the outgoing plate |
| `hudTick` | counters, stars | stepped, not eased — reads as a readout, not an animation |
| `toastDrop` | mission passed | 280ms drop and settle, auto-dismiss at 2.4s |

All motion collapses to instant state changes under `prefers-reduced-motion: reduce`. Plate cross-dissolves become hard cuts.

---

## 6. Art plates

Nine full-bleed illustrated plates, generated rather than photographed, each featuring Kishan in-scene.

**Consistency is the hard part** and the main risk to the whole concept. Nine images must read as one artist's work. The method:

1. **Style lock.** A fixed style block — medium, rendering, grain, lighting model, lens — reused verbatim in every prompt. Only the scene and time of day vary.
2. **Character lock.** A single reference portrait of Kishan drives all nine, so the face, hair, build and wardrobe stay constant. Wardrobe is fixed in the style block, not left to the model.
3. **Day cycle.** Times of day are assigned up front per the palette table above, so the set has a narrative arc instead of nine random skies.
4. **Dark anchor.** Every prompt — including the bright-daylight ones — carries an explicit dark structural element (deep shadow side, silhouetted foreground, night-side architecture). Without it the illustration style collapses toward flat stock rendering as scenes get brighter.
5. **Composition reserve.** Every plate keeps its left third and bottom-left corner visually quiet, because the menu and minimap sit there. This is a composition constraint in the prompt, not a crop applied afterwards.

Generation runs through the Higgsfield image tooling available in the build session. Kishan supplies one clear reference portrait; everything else is generated.

**Fallback.** Each screen ships with a CSS gradient in its accent colour, so the site is complete and presentable before a single plate exists, and stays usable if one fails to load.

**Delivery budget.** AVIF with WebP fallback, responsive `srcset` at 960 / 1440 / 1920 widths, ≤200KB per plate at 1920w. Only the current and next plates are preloaded; the rest are lazy.

---

## 7. Technical approach

- **Stack:** React 19, Vite 8, Tailwind 4, motion 13. No Astro, no GSAP, no new runtime dependencies.
- **Navigation:** hash routing (`#/skills`), so every screen is linkable, shareable and indexable, and the browser back button works.
- **Config:** one `src/data/screens.js` holds all nine screens — label, accent, watermark, objective, plate, content. Content changes never touch a component.
- **Loading splash:** progress bar over the first plate's decode, then the start screen. Dismisses immediately if assets are cached.
- **Video:** gameplay stays on YouTube, embedded on demand from the Projects screen exactly as the current build does — a click-to-play poster, never an autoplaying embed. No self-hosted video, no looping clips behind screens. Kishan's decision, and it removes the largest single item from the delivery budget.
- **State:** current screen, visited set, progression derived from the visited set. Persisted to `localStorage` behind a try/catch, since private browsing can throw.

---

## 8. Accessibility

The concept's main risk is burying content behind a game. Mitigations are mandatory, not optional:

- **Plain view.** A persistent "PLAIN RÉSUMÉ VIEW" control renders all nine screens' content as one conventional scrolling document. Recruiters who want facts in ten seconds get them, and this is also the crawlable, printable surface.
- **Real semantics.** The menu is a `tablist` with arrow-key navigation and roving tabindex; each screen is a `tabpanel` with a real `h1`. HUD decoration is `aria-hidden`.
- **Focus management.** Screen changes move focus to the new panel heading and announce it via a live region.
- **Keyboard.** Arrow keys navigate, Enter selects, Escape returns to the start screen, Tab reaches every control.
- **Touch.** Horizontal swipe changes screens; the menu collapses to a bottom sheet under 768px.
- **Reduced motion and save-data.** Cuts instead of dissolves, no ambient motion, static poster instead of any video loop.

---

## 9. Constraints and budgets

- JavaScript ≤ 180KB gzip.
- LCP ≤ 2.5s on simulated 4G mobile, measured against the first plate; CLS 0.
- Total transferred on first screen ≤ 600KB including the plate.
- WCAG AA on every screen's accent against its scrim.

### 9.1 Device matrix

Kishan's stated hard requirement: the interface must work on any device and must not break. The previous build shipped with content cut off on Android, so this is treated as a release gate, not a goal. Every screen must be verified at each of these widths before merge, in both orientations where applicable:

| Width | Represents | Layout |
|---|---|---|
| 320px | small Android, iPhone SE | HUD reduced to clock, stars and objective. Minimap dropped. Menu is a bottom sheet. Wordmark drops to `--fs-wordmark` minimum. |
| 390px | typical modern phone | As above, with the key-hint bar replaced by a swipe hint. |
| 768px | tablet portrait | Menu returns inline, left-aligned. Minimap returns. Full HUD. |
| 1024px | tablet landscape, small laptop | Desktop layout at reduced scale. |
| 1440px | standard laptop | Reference layout. |
| 1920px+ | desktop, ultrawide | Plate fills; content is capped so the menu never drifts far from the left edge. |

Additional non-negotiables:

- Landscape phone (e.g. 844×390) must remain usable — the plate letterboxes rather than pushing the HUD off-screen.
- No horizontal overflow at any width. `overflow-x: hidden` stays on `html, body`, and long strings wrap.
- Safe-area insets respected for notches and home indicators, as in the current build.
- Viewport units use `svh`/`dvh`, never bare `vh`, so mobile browser chrome cannot clip a screen.
- All interactive targets meet the 44px minimum.
- Verified on a real Android device before ship, not only in a simulator.

**Out of scope:** WebGL, GSAP, Astro, a blog, internationalisation, audio (the reference's radio strip is visual only — no autoplaying sound).

---

## 10. Assets required from Kishan

| Asset | Used by | Specification |
|---|---|---|
| Reference portrait | Character lock for all nine plates | Clear, front-facing, even lighting, shoulders up, 1600px+. This is the single highest-value asset; every plate depends on it. |
| Wardrobe preference | Style lock | What he wants to be wearing across all nine scenes, since it must stay constant |
| Choice of 2–3 web projects | Web Ops mission strand | Which React/Node applications will unlock those entries |
| Formspree endpoint | Contact | Free form ID, to replace the mailto fallback |

---

## 11. Risks

| Risk | Mitigation |
|---|---|
| Nine plates fail to look like one set | Style lock, character lock, dark anchor and day cycle are specified up front; plates are generated as a batch and reviewed together, never one at a time |
| Concept buries the content from recruiters | Plain résumé view is a first-class, always-available surface, not an afterthought |
| Nine large images blow the performance budget | AVIF, responsive sources, current-and-next preloading only, hard per-plate size cap, gradient fallbacks |
| The homage reads as a template clone | Location names, HUD counters, menu labels and mission framing are all drawn from Kishan's own work rather than copied from the reference |
| Web Ops strand never fills | Locked mission entries are a legitimate, designed state; if nothing ships, the strand can be removed without touching any other screen |

---

## 12. Next step

Turn this into a phased implementation plan: shell and config → HUD → menu and screen transitions → the nine screens' content → plate generation → plain view and accessibility → performance pass → ship. Each phase independently reviewable and deployable.
