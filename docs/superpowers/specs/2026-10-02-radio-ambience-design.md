# KJ-FM Radio — opt-in ambience and menu sounds

Approved in chat 2026-10-02. Amends the pause-menu spec (`2026-09-20-portfolio-pause-menu-design.md`): "autoplaying audio" stays forbidden; an opt-in radio that is off by default is allowed.

## Behaviour

- The HUD's `KJ-FM 96.7` RadioStrip becomes a real `<button aria-pressed>` with visible ON/OFF state, accessible name like "KJ-FM radio", ≥44px target, visible at every width including phones (no overlap with the clock at 320px, no horizontal overflow at 320, 390, 768, 1024, 1280×720, 1366×768, 1440×900, 1920×1080, 844×390).
- Default **OFF** on a first visit.
- ON: a quiet synthesized night-city pad fades in over ~1.5s — detuned oscillator chords through a lowpass filter whose cutoff drifts on a slow LFO, a faint band-passed noise bed ("distant traffic"), and a gentle chord change roughly every 8s. OFF fades it out (~1s) then stops sources.
- While ON, menu sounds play: a soft short blip when the selected tab moves via arrow keys / Home / End or swipe (`blip('move')`), and a two-note confirm when a screen is chosen by click/tap/Enter (`blip('select')`). No sounds while OFF.
- EQ bars in the strip animate (transform `scaleY` only) only when ON and `useAmbientMotion()` is true; static otherwise.
- Pauses (AudioContext suspend) when `document.visibilityState === 'hidden'`, resumes on return if still ON.
- Preference persisted per device in localStorage (key `kj-radio`, try/catch, like `useProgress`). A returning visitor whose stored preference is ON hears it begin at their **first user-activation gesture** on the page — never on load. Per the HTML user-activation rules that is a keydown (not Escape), a mouse pointerdown, or a touch/pen pointerup / touchend (`click` is listened for as a backstop for older iOS); a touch pointerdown does not count. Each such gesture retries the unlock until the context actually runs. UI shows ON (pending) state honestly: the EQ bars move only while the AudioContext reports `running`.
- While a start is blocked (the browser refused to resume) or the context is suspended, blips are dropped rather than queued, so they can never burst out together when audio is finally allowed.
- The plain résumé view has no radio control, so an ON radio is suspended while it is shown (the stored preference stays ON) and resumes on the way back; the PLAIN buttons do not count as the first gesture.
- Loudness: master gain peak around -24 dBFS for the pad; blips a little above the pad but short (<120ms) and soft.

## Architecture

- `src/audio/radio.js` — Web Audio engine. Nothing (no AudioContext) is created until the first `start()`. API: `start()` (async, creates/resumes context, fades in), `stop()` (fade out, release sources), `blip(kind)` with kind `'move' | 'select'`, `suspend()`, `resume()`, `subscribe(fn)` (called with whether the context is running on every `statechange`; returns an unsubscribe). Calling `start()` again while playing only retries `resume()`. Silently no-ops when `window.AudioContext`/`webkitAudioContext` is unavailable or throws. Chord scheduling via a timer at ~8s cadence is acceptable (not an animation loop); clear it on stop.
- `src/state/useRadio.js` — `{ on, toggle, blip }`; owns persistence, first-gesture resume, visibility pause, and a `muted` option (used for the plain résumé view). Follows the engine's real context state via `subscribe(fn)`. Accepts an injectable engine for tests.
- `RadioStrip.jsx` — toggle button; `Hud.jsx` passes props and shows it at all widths.
- `App.jsx` — calls `blip` from the existing Menu `onSelect(id, source)` (source `'keyboard'` → move, otherwise select) and swipe navigation (move).

## Constraints

No new runtime dependencies; no audio files; JS stays ≤180KB gzip (expect ~+3KB); motion transform/opacity only; WCAG AA text (no text below bone/60); ≥44px targets; never bare `vh`.

## Testing

jsdom has no Web Audio: tests use a fake engine. Assert: no engine start / AudioContext before toggle; aria-pressed and persistence round-trip; stored ON does not start on mount but starts on the first activation gesture (mouse pointerdown, touch pointerup/touchend, click, keydown; not a touch pointerdown); blips are dropped while a start is blocked; blip fires on select only when ON with the right kind; visibility hidden suspends. Real-browser layout checked with Playwright at the widths above. Sound quality is judged by Kishan by ear.
