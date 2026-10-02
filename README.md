<div align="center">

<img src="public/plates/1-start-1440.webp" alt="The portfolio's Start screen art plate" width="720">

# Kishan Jaiswal — Real-Time Systems Engineer (Unity & Web)

**Games people play, and the products behind them.**
5+ years shipping production game systems in Unity/C#, plus React / Node.js / TypeScript product work (this site is one).

### [kishan831.github.io](https://kishan831.github.io/)

[![Live site](https://img.shields.io/badge/Live-kishan831.github.io-0a0a0a?style=for-the-badge&logo=githubpages&logoColor=white)](https://kishan831.github.io/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Kishan%20Jaiswal-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kishan-jaiswal-2586a4220/)
[![Email](https://img.shields.io/badge/Email-jaiswalkishan628%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:jaiswalkishan628@gmail.com)

![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-0F172A?style=flat-square&logo=tailwindcss&logoColor=38BDF8)
![Vitest](https://img.shields.io/badge/Vitest_5-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=flat-square&logo=githubpages&logoColor=white)

</div>

---

## At a glance

| 5+ years | 50+ projects | 67+ casino games shipped | 30+ built from scratch | 15 developers led |
| :---: | :---: | :---: | :---: | :---: |

- **Now:** Unity Developer at Bilions (Austin, TX), working remotely from India. Building a 67-game casino platform with Stack Engine and RGS integration.
- **Two pillars:** Unity/C# game systems, and React / Node.js / TypeScript products.
- **Status:** open to opportunities. [Résumé (PDF, Unity-focused)](public/assets/resume.pdf)

---

## About the site

The portfolio is built as a **game pause menu**. Every section is a "screen" with its own full-bleed art plate, accent colour and mission objective. A HUD frames it all: a clock, a star rating and a "shipped" counter that fill as you explore, a minimap, and a journey bar. The first visit to each screen shows a "Mission passed" toast, and progress is remembered between visits.

### The nine screens

Every screen has its own deep link at `https://kishan831.github.io/#/<id>`.

| # | id | Menu label | What it shows |
| :-: | :-- | :-- | :-- |
| 1 | `start` | START GAME | Hero, headline stats, **See the work** and **Résumé** buttons |
| 2 | `about` | ABOUT ME | Bio, experience, location, current role, status |
| 3 | `skills` | SKILLS | Capability bars in real units (e.g. `5 YRS`, `67+ TITLES`), never percentages |
| 4 | `projects` | PROJECTS | **Casino Ops** (game builds with Watch / Code / Case File) and **Web Ops** (web products: this site live, two in development) |
| 5 | `experience` | EXPERIENCE | Current role card plus career timeline |
| 6 | `achievements` | ACHIEVEMENTS | Trophy list |
| 7 | `academy` | ACADEMY | Skill groups ("Loadout") |
| 8 | `contact` | CONTACT | Email / GitHub / LinkedIn / YouTube, plus a contact form validated in the browser |
| 9 | `exit` | EXIT GAME | "Mission complete", with Résumé, Get in touch and Back to start |

**Case files:** two projects open a full case-study dialog. One is **Slot Empire**, the 67+ game casino platform (Addressables, Socket.IO, in-app updates, RNG/RTP, Stack Engine + RGS). The other is **Advanced Tetris**, a guideline-compliant engine (SRS wall-kicks, 7-bag, T-spins, four modes, MVC + ScriptableObjects).

---

## Highlights

### Accessibility
- The menu is a real **ARIA tablist** with a roving tabindex, so the whole menu is a single Tab stop. Each item is a `role="tab"` that controls its `role="tabpanel"`.
- The first Tab stop is a **Skip to content** link. The panel takes focus on a screen change, except while you are arrowing through the menu, where focus stays on the tab. A polite live region announces `<LABEL> screen`.
- The mobile menu sheet and the case-study dialog are `role="dialog"` with `aria-modal`, and both close when you click the backdrop. Opening the case study focuses its close button. The sheet focuses the active tab on open and returns focus to the MENU button on close.
- Escape is ignored while focus is inside a form field, so it does not throw away text you are typing.
- Design targets: WCAG AA accent contrast, hit targets of at least 44px, and no horizontal overflow from 320px up to 1920px wide.

### Keyboard and touch

| Input | Action |
| :-- | :-- |
| `Tab` / `Shift+Tab` | Move between regions (the menu is one stop) |
| `↑` / `↓` | Previous / next screen (wraps around) |
| `Home` / `End` | Jump to Start / Exit |
| `Enter` / `Space` | Activate the focused tab |
| `Esc` | Close the case study, then the mobile sheet, then go to Start |
| Swipe left / right | Next / previous screen on touch devices (no wrap) |

The browser's back and forward buttons work too, because routing is hash-based (`#/<id>`).

### Reduced motion and Save-Data
- One hook, `useAmbientMotion`, gates the plate layer and the menu sheet: the screen crossfade, the drift, the grain/sweep/neon plate effects, the per-screen sprite loops and the sheet's slide. All of it stays off under `prefers-reduced-motion: reduce` or `navigator.connection.saveData`.
- A few short UI transitions are not routed through the hook: the boot splash's loader sweep, the "Mission passed" toast and the case-study dialog's enter/exit. They still play under Save-Data.
- CSS backs this up. Under reduced motion, CSS animations and transitions (including the splash loader) are cut to near zero, and the `.fx-*` layers are disabled.
- The ambient plate animations only touch `transform` and `opacity`, and there are no continuous JS animation loops.

### Plain résumé view
One click on **PLAIN RÉSUMÉ VIEW** (or **PLAIN** on phones) swaps the game UI for a plain, single-page document built from the same data: contact links, About and stats, Skills, Projects, Experience, Achievements and Contact. It is written for recruiters, ATS-style readers and anyone who would rather skip the theatrics.

### Performance budgets

| Budget | Target | Current build |
| :-- | :-- | :-- |
| JavaScript (gzip, total) | ≤ 180 KB | **129.43 KB** (one 410.91 KB chunk) |
| CSS (gzip) | — | about 9 KB (about 41 KB raw) |
| HTML (gzip) | — | about 1.6 KB |
| Each art plate at full width | ≤ 200 KiB | largest is 198 KiB (`2-about-1672.webp`, 202,332 bytes) |
| LCP, simulated 4G mobile | ≤ 2.5 s | target |
| CLS | 0 | target |
| First-screen transfer | ≤ 600 KB | target |

Plates ship as AVIF with a WebP fallback at 960 / 1440 / 1672 px. The Start plate is preloaded and fetched eagerly; every other plate loads lazily. Display fonts (Anton, Kaushan Script) are self-hosted `woff2` files with `font-display: swap`. Layout heights use `svh`/`dvh` rather than bare `vh`.

---

## Tech stack

| Layer | Choice |
| :-- | :-- |
| UI | React 19 |
| Build / dev server | Vite 8 (`@vitejs/plugin-react`) |
| Styling | Tailwind CSS 4, configured CSS-first through `@theme` (there is no `tailwind.config.js`) |
| Animation | `motion` 13 |
| Icons | `lucide-react`, plus inline Simple Icons SVGs for GitHub, LinkedIn and YouTube |
| Tests | Vitest 5, jsdom, Testing Library |
| Image pipeline | `sharp` (development only) |
| Hosting | GitHub Pages, deployed by GitHub Actions |

There are only four runtime dependencies (`react`, `react-dom`, `motion`, `lucide-react`). No WebGL, no backend.

---

## Getting started

### Prerequisites
- **Node.js 22 (≥ 22.22.2), 24 (≥ 24.15) or 26+.** jsdom 30 requires it. Node 23 and 25 are not supported, and since `package.json` has no `engines` field, npm will not warn you about them. CI uses Node 22.
- npm (it ships with Node)

### Install and run

```bash
git clone https://github.com/kishan831/kishan831.github.io.git
cd kishan831.github.io
npm ci            # or: npm install
npm run dev       # start the Vite dev server
```

### Scripts

| Command | What it does |
| :-- | :-- |
| `npm run dev` | Vite dev server with HMR |
| `npm test` | Run the test suite once (`vitest run`): 11 files, 77 tests |
| `npm run test:watch` | Vitest in watch mode |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run plates` | Regenerate the art plates (see [Art plates pipeline](#art-plates-pipeline)) |

---

## Project structure

```text
.
├── .github/workflows/deploy.yml   # test, build and deploy to GitHub Pages
├── docs/superpowers/              # design specs, art-plate prompts, implementation plan
├── public/
│   ├── assets/                    # resume.pdf, og-image.png, kishan.jpg
│   ├── fonts/                     # self-hosted Anton + Kaushan Script (woff2)
│   ├── plates/                    # 54 committed plates: 9 screens × 3 widths × AVIF/WebP
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/build-plates.mjs       # PNG to AVIF/WebP converter with a size budget
├── src/
│   ├── main.jsx                   # React root (StrictMode)
│   ├── App.jsx                    # shell: routing, progress, Esc/swipe, menus, plates, HUD, plain view
│   ├── index.css                  # Tailwind @theme tokens, per-screen accents, fx keyframes, reduced-motion rules
│   ├── data/
│   │   ├── screens.js             # the nine screen definitions + getScreen()
│   │   └── portfolio.js           # all content: stats, projects, experience, socials, case studies…
│   ├── state/
│   │   ├── useHashRoute.js        # #/<id> routing with back/forward support
│   │   ├── useProgress.js         # visited screens in localStorage → stars + shipped counter
│   │   └── useAmbientMotion.js    # reduced-motion / Save-Data gate
│   └── components/
│       ├── Plate.jsx              # responsive <picture> art plate
│       ├── PlateFX.jsx            # CSS grain / sweep / neon overlay
│       ├── Sprites.jsx            # per-screen ambient sprite loops
│       ├── Splash.jsx             # boot splash
│       ├── Toast.jsx              # "Mission passed" toast
│       ├── PlainView.jsx          # plain résumé document
│       ├── CaseStudyModal.jsx     # project case-study dialog
│       ├── BrandIcons.jsx         # GitHub / LinkedIn / YouTube SVGs
│       ├── menu/                  # Menu.jsx (tablist), MenuItem.jsx (tab)
│       ├── hud/                   # Hud.jsx + Clock, Stars, ShippedCounter, Minimap, Objective, KeyHints, JourneyBar, RadioStrip
│       └── screens/               # ScreenBody.jsx (id → body) + the nine *Screen.jsx bodies
├── index.html                     # meta, OG tags, JSON-LD, Start-plate preload
├── vite.config.js                 # base '/', outDir dist, Vitest config
└── vitest.setup.js                # jest-dom, cleanup, matchMedia/IntersectionObserver polyfills
```

Tests live next to the code as `*.test.js(x)` files.

Vite copies everything in `public/` into `dist/`, including gitignored files. A local `npm run build` or `npm run preview` therefore also ships any local-only material in `public/` (such as a gitignored `public/assets/GTA Theme portfolio/` reference folder), while the CI build does not. Keep reference material under `reference/` instead.

---

## Editing content

| To change… | Edit |
| :-- | :-- |
| Stats, bio data, skills, experience, projects, achievements, socials, case studies | `src/data/portfolio.js` |
| Screen order, labels, objectives, icons, plate names | `src/data/screens.js` |
| Screen layout or copy that is not in the data (hero lede, About rows…) | `src/components/screens/<Name>Screen.jsx` |
| Accent colours | **both** `src/data/screens.js` (`accent`) **and** the `[data-screen='…']` rules in `src/index.css`. Components read `var(--accent)` / `var(--accent-hi)` from CSS; `accent` in screens.js tints the plate's fallback gradient. The highlight colour comes only from `--accent-hi` in index.css (`accentHi` in screens.js is unused) |
| Page title, meta description, OG tags, JSON-LD | `index.html` |
| Résumé | replace `public/assets/resume.pdf` |

Notes:
- **Shipping a Web Ops project.** In `webProjects` (in `portfolio.js`), change its `status` from `'locked'` to `'live'` and add `repo` (the CODE link). A `url` field is not rendered. Locked entries show as "IN DEVELOPMENT".
- **Adding or removing a screen.** Reordering or relabelling only needs `screens.js`. Adding or removing a screen also needs an entry in the id-to-component map in `src/components/screens/ScreenBody.jsx`, a `[data-screen='…']` rule in `src/index.css`, a plate, and an updated screen count in `src/data/screens.test.js` (it expects 9). Otherwise the CI test step fails and blocks the deploy.
- **Adding a case study.** Add an entry to `caseStudies` and set a matching `caseId` on the project. The **CASE FILE** button then shows up.
- **Copy rule:** use real numbers only (5+ years, 50+ projects, 67+ casino games, 30+ from scratch, 15 developers led), with no invented percentages.

---

## Art plates pipeline

Each screen has a 16:9 art plate named `<n>-<id>` (for example `1-start`, `7-academy`). It sits on top of an accent radial-gradient fallback, and that fallback is the intended look whenever a plate is missing.

1. Generate the key art. The prompts, style and character locks, composition rules (left third and bottom-left kept clear for the menu and minimap) and a fix-it table are in [`docs/superpowers/specs/2026-09-20-art-plate-prompts.md`](docs/superpowers/specs/2026-09-20-art-plate-prompts.md).
2. Save each PNG as `reference/plates-source/<n>-<id>.png`, e.g. `reference/plates-source/2-about.png`. This folder is **gitignored**, so the roughly 2 MB sources stay local. Do **not** put PNGs in `public/plates/`. Sources must be 16:9 and at least 1672 px wide (the current ones are 1672×941). Narrower sources are not upscaled, so the `-1672` files would come out undersized without any warning.
3. Run the converter:
   ```bash
   npm run plates
   ```
   It uses `sharp` to write `public/plates/<n>-<id>-{960,1440,1672}.{avif,webp}` (AVIF q52, WebP q74). It **fails if any output rounds to more than 200 KiB** (about 205 KB). The files are written before the budget check, so a failed run still leaves the over-budget files in `public/plates/`. If it fails, lower the quality or crop the source and run it again, or restore the committed plates with `git checkout -- public/plates` before you commit.
4. Commit the generated files in `public/plates/`.

Two gotchas:
- On a fresh clone `reference/` does not exist. Create `reference/plates-source/` first, because the script crashes with `ENOENT` if the folder is missing.
- The art spec's step 6 still describes an older naming scheme (`plate-1-start.png` placed in `public/plates/`), and it calls screen 7 "Garage". Follow the steps above instead. Screen 7 is `academy`.

---

## Contact form

`FORMSPREE_ACTION` in `src/data/portfolio.js` is currently an empty string. While it is empty, the form checks name, email and message, then opens a prefilled `mailto:` to jaiswalkishan628@gmail.com.

To turn on real submissions:

1. Create a form at [formspree.io](https://formspree.io/).
2. Set the endpoint:
   ```js
   export const FORMSPREE_ACTION = 'https://formspree.io/f/<your-form-id>'
   ```
3. Rebuild and deploy. The form then POSTs `name`, `email` and `message` to Formspree.

---

## Deployment

Every push to `main` deploys automatically through [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). It can also be started by hand with **workflow_dispatch**.

```text
checkout → setup Node 22 (npm cache) → npm ci → npx vitest run → npm run build → upload ./dist → deploy-pages
```

A failing test stops the deploy.

**One-time setup:** in the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. With the old "Deploy from a branch" setting, Pages would serve the raw source and the site would break.

- `vite.config.js` uses `base: '/'` because this is a user Pages site served at the domain root.
- `dist/` is gitignored and never committed.
- There is no custom domain (no `CNAME`). The canonical URL is https://kishan831.github.io/.

---

## License

There is no license file yet, so all rights are reserved. The code is public for reference. Please ask before reusing the art, copy or design.

---

## Contact

- **Portfolio:** https://kishan831.github.io/
- **LinkedIn:** [Kishan Jaiswal](https://www.linkedin.com/in/kishan-jaiswal-2586a4220/)
- **GitHub:** [@kishan831](https://github.com/kishan831)
- **YouTube:** [Gameplay demos](https://www.youtube.com/channel/UCrN0559CtMg-NeUi-9bqrTQ)
- **Email:** [jaiswalkishan628@gmail.com](mailto:jaiswalkishan628@gmail.com)
