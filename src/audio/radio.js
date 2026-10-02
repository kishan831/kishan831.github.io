/**
 * KJ-FM 96.7 — a tiny Web Audio synth for the opt-in HUD radio.
 *
 * Nothing here touches Web Audio until the first start(): no AudioContext is
 * constructed on import or on blip()/suspend()/resume() calls before that, so
 * a visitor who never presses the toggle never gets an audio context at all.
 *
 * The pad: a slow loop of low, gentle seventh/ninth chords (Am9, Fmaj9, Cmaj9,
 * G6), each note a pair of slightly detuned oscillators, all through one
 * lowpass whose cutoff drifts on a very slow LFO. Underneath, a faint
 * band-passed pink-noise bed stands in for distant traffic. Everything is
 * synthesized: there are no audio files.
 */

/** Master level for the pad: about -24 dBFS. The pad mix below sums to <= 1. */
export const PAD_PEAK = 0.063
/** Blips sit a little above the pad (about -21 dBFS) but are very short. */
const BLIP_PEAK = 0.09

const FADE_IN = 1.5
const FADE_OUT = 1.0
const CHORD_MS = 8000
const ATTACK = 3
const RELEASE_TAU = 1.4

const CUTOFF = 720
const CUTOFF_DEPTH = 320
const CUTOFF_LFO_HZ = 0.045

const midi = (n) => 440 * 2 ** ((n - 69) / 12)

// Low-register voicings with smooth voice leading between neighbours.
const CHORDS = [
  [45, 52, 55, 59, 60], // Am9   A2 E3 G3 B3 C4
  [41, 48, 52, 55, 57], // Fmaj9 F2 C3 E3 G3 A3
  [48, 52, 55, 59, 62], // Cmaj9 C3 E3 G3 B3 D4
  [43, 50, 52, 55, 59], // G6    G2 D3 E3 G3 B3
]

// Per-note mix: a quiet sawtooth for body and a triangle for warmth. Five
// notes x 0.14 plus the root sub and the noise bed stay under 1.0 combined.
const SAW_LEVEL = 0.05
const TRI_LEVEL = 0.09
const SUB_LEVEL = 0.12
const NOISE_LEVEL = 0.08
const NOISE_SWELL = 0.035
const DETUNE_CENTS = 7

function audioContextCtor() {
  if (typeof window === 'undefined') return null
  return window.AudioContext || window.webkitAudioContext || null
}

function safely(fn) {
  try {
    return fn()
  } catch {
    return undefined
  }
}

/** Paul Kellet's economical pink-noise filter over white noise. */
function pinkNoiseBuffer(ctx, seconds = 4) {
  const length = Math.floor(ctx.sampleRate * seconds)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    b0 = 0.99886 * b0 + white * 0.0555179
    b1 = 0.99332 * b1 + white * 0.0750759
    b2 = 0.969 * b2 + white * 0.153852
    b3 = 0.8665 * b3 + white * 0.3104856
    b4 = 0.55 * b4 + white * 0.5329522
    b5 = -0.7616 * b5 - white * 0.016898
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
    b6 = white * 0.115926
  }
  // Fade the loop seam so the bed never clicks when it wraps.
  const edge = Math.min(length >> 1, Math.floor(ctx.sampleRate * 0.05))
  for (let i = 0; i < edge; i++) {
    const k = i / edge
    data[i] *= k
    data[length - 1 - i] *= k
  }
  return buffer
}

export function createRadio() {
  let ctx = null
  let unavailable = false
  let graph = null
  let mode = 'idle' // 'idle' | 'playing' | 'stopping'
  let paused = false
  let chordTimer = null
  let teardownTimer = null
  let chordIndex = 0

  function ensureContext() {
    if (ctx) return true
    if (unavailable) return false
    const Ctor = audioContextCtor()
    if (!Ctor) {
      unavailable = true
      return false
    }
    try {
      ctx = new Ctor()
      return true
    } catch {
      unavailable = true
      ctx = null
      return false
    }
  }

  function track(node) {
    graph.nodes.add(node)
    return node
  }

  function trackSource(node) {
    graph.nodes.add(node)
    graph.sources.add(node)
    return node
  }

  function build() {
    const now = ctx.currentTime
    graph = { nodes: new Set(), sources: new Set(), chord: null }

    const master = track(ctx.createGain())
    master.gain.setValueAtTime(0, now)
    master.connect(ctx.destination)

    const lowpass = track(ctx.createBiquadFilter())
    lowpass.type = 'lowpass'
    lowpass.frequency.value = CUTOFF
    lowpass.Q.value = 0.7
    lowpass.connect(master)

    const cutoffLfo = trackSource(ctx.createOscillator())
    cutoffLfo.type = 'sine'
    cutoffLfo.frequency.value = CUTOFF_LFO_HZ
    const cutoffDepth = track(ctx.createGain())
    cutoffDepth.gain.value = CUTOFF_DEPTH
    cutoffLfo.connect(cutoffDepth)
    cutoffDepth.connect(lowpass.frequency)
    cutoffLfo.start(now)

    // Distant traffic: looping pink noise, band-passed low and swelling slowly.
    const noise = trackSource(ctx.createBufferSource())
    noise.buffer = pinkNoiseBuffer(ctx)
    noise.loop = true
    const band = track(ctx.createBiquadFilter())
    band.type = 'bandpass'
    band.frequency.value = 420
    band.Q.value = 0.6
    const noiseGain = track(ctx.createGain())
    noiseGain.gain.value = NOISE_LEVEL
    const swell = trackSource(ctx.createOscillator())
    swell.type = 'sine'
    swell.frequency.value = 0.07
    const swellDepth = track(ctx.createGain())
    swellDepth.gain.value = NOISE_SWELL
    swell.connect(swellDepth)
    swellDepth.connect(noiseGain.gain)
    noise.connect(band)
    band.connect(noiseGain)
    noiseGain.connect(master)
    noise.start(now)
    swell.start(now)

    // Menu blips bypass the pad's fade so the first one is never swallowed.
    const blipBus = track(ctx.createGain())
    blipBus.gain.value = 1
    blipBus.connect(ctx.destination)

    graph.master = master
    graph.lowpass = lowpass
    graph.blipBus = blipBus
  }

  function rampMaster(target, seconds) {
    const param = graph.master.gain
    const now = ctx.currentTime
    const current = param.value
    param.cancelScheduledValues(now)
    param.setValueAtTime(current, now)
    param.linearRampToValueAtTime(target, now + seconds)
  }

  function playChord(notes) {
    const now = ctx.currentTime
    const chordGain = ctx.createGain()
    chordGain.gain.setValueAtTime(0, now)
    chordGain.gain.linearRampToValueAtTime(1, now + ATTACK)
    chordGain.connect(graph.lowpass)

    const voice = { gain: chordGain, oscs: [], extras: [chordGain] }
    const canPan = typeof ctx.createStereoPanner === 'function'

    const addOsc = (type, freq, detune, level, pan) => {
      const osc = ctx.createOscillator()
      osc.type = type
      osc.frequency.value = freq
      osc.detune.value = detune
      const g = ctx.createGain()
      g.gain.value = level
      osc.connect(g)
      let tail = g
      if (canPan && pan) {
        const p = ctx.createStereoPanner()
        p.pan.value = pan
        g.connect(p)
        tail = p
        voice.extras.push(p)
      }
      tail.connect(chordGain)
      voice.extras.push(g)
      voice.oscs.push(osc)
      osc.start(now)
    }

    notes.forEach((n, i) => {
      const f = midi(n)
      const spread = i % 2 === 0 ? 0.3 : -0.3
      addOsc('sawtooth', f, -DETUNE_CENTS, SAW_LEVEL, spread)
      addOsc('triangle', f, DETUNE_CENTS, TRI_LEVEL, -spread)
    })
    addOsc('sine', midi(notes[0] - 12), 0, SUB_LEVEL, 0)

    for (const n of [...voice.extras, ...voice.oscs]) graph.nodes.add(n)
    for (const o of voice.oscs) graph.sources.add(o)
    return voice
  }

  function releaseChord(voice) {
    if (!voice || !graph) return
    const now = ctx.currentTime
    voice.gain.gain.cancelScheduledValues(now)
    voice.gain.gain.setTargetAtTime(0, now, RELEASE_TAU)
    const end = now + RELEASE_TAU * 5
    let remaining = voice.oscs.length
    const g = graph
    for (const osc of voice.oscs) {
      osc.onended = () => {
        safely(() => osc.disconnect())
        g.nodes.delete(osc)
        g.sources.delete(osc)
        remaining -= 1
        if (remaining === 0) {
          for (const n of voice.extras) {
            safely(() => n.disconnect())
            g.nodes.delete(n)
          }
        }
      }
      safely(() => osc.stop(end))
    }
  }

  function nextChord() {
    chordTimer = null
    if (mode !== 'playing' || paused || !graph) return
    // A context the browser has not let run yet would just pile up voices.
    if (ctx.state === 'running') {
      chordIndex = (chordIndex + 1) % CHORDS.length
      const previous = graph.chord
      graph.chord = playChord(CHORDS[chordIndex])
      releaseChord(previous)
    }
    scheduleChords()
  }

  function scheduleChords() {
    if (chordTimer) clearTimeout(chordTimer)
    chordTimer = setTimeout(nextChord, CHORD_MS)
  }

  function clearChordTimer() {
    if (chordTimer) clearTimeout(chordTimer)
    chordTimer = null
  }

  function teardown() {
    teardownTimer = null
    clearChordTimer()
    if (graph) {
      for (const s of graph.sources) {
        s.onended = null
        safely(() => s.stop())
      }
      for (const n of graph.nodes) safely(() => n.disconnect())
      graph = null
    }
    if (ctx) {
      const closing = ctx
      ctx = null
      safely(() => closing.close?.()?.catch?.(() => {}))
    }
    mode = 'idle'
    paused = false
  }

  return {
    /** Creates or resumes the context and fades the pad in. Resolves true once audio is running. */
    async start() {
      if (!ensureContext()) return false
      if (teardownTimer) {
        clearTimeout(teardownTimer)
        teardownTimer = null
      }
      try {
        if (!graph) {
          build()
          chordIndex = 0
          graph.chord = playChord(CHORDS[0])
        }
        mode = 'playing'
        paused = false
        rampMaster(PAD_PEAK, FADE_IN)
        if (!chordTimer) scheduleChords()
      } catch {
        teardown()
        return false
      }

      // resume() can stay pending forever without a user activation, so cap the wait.
      let timer
      try {
        await Promise.race([
          Promise.resolve(ctx.resume()),
          new Promise((r) => {
            timer = setTimeout(r, 400)
          }),
        ])
      } catch {
        // Fall through and report the state as it is.
      } finally {
        clearTimeout(timer)
      }
      return ctx?.state === 'running'
    },

    /** Fades out over ~1s, then stops every source and releases the graph and context. */
    stop() {
      if (mode !== 'playing' || !ctx || !graph) return
      mode = 'stopping'
      clearChordTimer()
      safely(() => rampMaster(0, FADE_OUT))
      teardownTimer = setTimeout(teardown, FADE_OUT * 1000 + 80)
    },

    /** A soft UI sound: 'move' (one short note) or 'select' (two rising notes). */
    blip(kind) {
      if (mode !== 'playing' || !ctx || !graph) return
      safely(() => {
        const t = ctx.currentTime + 0.005
        const notes =
          kind === 'select'
            ? [
                [659.25, t, 0.05],
                [987.77, t + 0.055, 0.055],
              ]
            : [[880, t, 0.07]]
        for (const [freq, at, dur] of notes) {
          const osc = ctx.createOscillator()
          osc.type = 'triangle'
          osc.frequency.value = freq
          osc.frequency.setValueAtTime(freq, at)
          osc.frequency.exponentialRampToValueAtTime(freq * 0.96, at + dur)
          const env = ctx.createGain()
          env.gain.value = 0
          env.gain.setValueAtTime(0, at)
          env.gain.linearRampToValueAtTime(BLIP_PEAK, at + 0.006)
          env.gain.exponentialRampToValueAtTime(0.0001, at + dur)
          osc.connect(env)
          env.connect(graph.blipBus)
          osc.onended = () => {
            safely(() => osc.disconnect())
            safely(() => env.disconnect())
          }
          osc.start(at)
          osc.stop(at + dur + 0.005)
        }
      })
    },

    /** Pauses the context (tab hidden) and the chord clock with it. */
    suspend() {
      if (!ctx || mode !== 'playing') return
      paused = true
      clearChordTimer()
      safely(() => Promise.resolve(ctx.suspend()).catch(() => {}))
    },

    /** Picks up again after suspend(). */
    resume() {
      if (!ctx || mode !== 'playing') return
      paused = false
      safely(() => Promise.resolve(ctx.resume()).catch(() => {}))
      if (!chordTimer) scheduleChords()
    },
  }
}

/** The app's single engine. Creating it is free: no audio exists until start(). */
export const radio = createRadio()
