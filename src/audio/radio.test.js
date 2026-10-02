import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRadio, PAD_PEAK } from './radio'
import { installFakeAudio } from '../test/fakeAudioContext'

let audio

beforeEach(() => {
  vi.useFakeTimers()
  audio = installFakeAudio()
})

afterEach(() => {
  audio.restore()
  vi.useRealTimers()
})

const masterOf = (ctx) =>
  ctx.of('gain').find((g) => g.connections.includes(ctx.destination) && g.gain.events.some((e) => e[0] === 'linear'))

describe('radio engine', () => {
  it('creates no AudioContext until start()', () => {
    const radio = createRadio()
    radio.blip('move')
    radio.suspend()
    radio.resume()
    radio.stop()
    expect(audio.Ctor).not.toHaveBeenCalled()
  })

  it('start() creates one context, resumes it and fades the master in over ~1.5s to about -24 dBFS', async () => {
    const radio = createRadio()
    await expect(radio.start()).resolves.toBe(true)
    expect(audio.Ctor).toHaveBeenCalledTimes(1)
    const [ctx] = audio.contexts
    expect(ctx.resume).toHaveBeenCalled()

    expect(20 * Math.log10(PAD_PEAK)).toBeGreaterThan(-26)
    expect(20 * Math.log10(PAD_PEAK)).toBeLessThan(-22)

    const master = masterOf(ctx)
    expect(master).toBeTruthy()
    const ramp = master.gain.events.find((e) => e[0] === 'linear')
    expect(ramp[1]).toBeCloseTo(PAD_PEAK, 5)
    expect(ramp[2]).toBeGreaterThanOrEqual(1.2)
    expect(ramp[2]).toBeLessThanOrEqual(1.8)

    // Detuned oscillator chord through a lowpass whose cutoff an LFO drives.
    const lowpass = ctx.of('biquad').find((f) => f.type === 'lowpass')
    expect(lowpass).toBeTruthy()
    const lfoDepth = ctx.of('gain').find((g) => g.connections.includes(lowpass.frequency))
    expect(lfoDepth).toBeTruthy()
    const detunes = ctx.of('oscillator').map((o) => o.detune.value).filter((d) => d !== 0)
    expect(detunes.length).toBeGreaterThanOrEqual(4)

    // Band-passed noise bed from a generated buffer.
    const noise = ctx.of('bufferSource').find((s) => s.loop)
    expect(noise?.buffer).toBeTruthy()
    expect(ctx.of('biquad').some((f) => f.type === 'bandpass')).toBe(true)
  })

  it('a second start() reuses the context', async () => {
    const radio = createRadio()
    await radio.start()
    await radio.start()
    expect(audio.Ctor).toHaveBeenCalledTimes(1)
  })

  it('changes chord roughly every 8 seconds', async () => {
    const radio = createRadio()
    await radio.start()
    const [ctx] = audio.contexts
    const before = ctx.of('oscillator').length
    vi.advanceTimersByTime(7000)
    expect(ctx.of('oscillator').length).toBe(before)
    vi.advanceTimersByTime(1500)
    expect(ctx.of('oscillator').length).toBeGreaterThan(before)
  })

  it('stop() fades out over ~1s, then stops every source, disconnects the graph and clears the chord timer', async () => {
    const radio = createRadio()
    await radio.start()
    const [ctx] = audio.contexts
    radio.stop()

    const master = masterOf(ctx)
    const fade = master.gain.events.filter((e) => e[0] === 'linear').at(-1)
    expect(fade[1]).toBe(0)
    expect(fade[2]).toBeGreaterThanOrEqual(0.8)
    expect(fade[2]).toBeLessThanOrEqual(1.2)

    // Still sounding during the fade.
    expect(ctx.sources().every((s) => s.stoppedAt === undefined)).toBe(true)

    vi.advanceTimersByTime(1500)
    expect(ctx.sources().length).toBeGreaterThan(0)
    expect(ctx.sources().every((s) => s.stoppedAt !== undefined)).toBe(true)
    expect(ctx.nodes.filter((n) => n.kind !== 'destination').every((n) => n.disconnected)).toBe(true)

    const count = ctx.nodes.length
    vi.advanceTimersByTime(30000)
    expect(ctx.nodes.length).toBe(count)
  })

  it('start() during the fade-out cancels the teardown', async () => {
    const radio = createRadio()
    await radio.start()
    const [ctx] = audio.contexts
    radio.stop()
    vi.advanceTimersByTime(400)
    await radio.start()
    vi.advanceTimersByTime(2000)
    const playing = ctx.sources().filter((s) => s.stoppedAt === undefined)
    expect(playing.length).toBeGreaterThan(0)
  })

  it("blip('move') is one short soft note", async () => {
    const radio = createRadio()
    await radio.start()
    const [ctx] = audio.contexts
    const before = ctx.of('oscillator').length
    radio.blip('move')
    const blips = ctx.of('oscillator').slice(before)
    expect(blips.length).toBeGreaterThanOrEqual(1)
    for (const o of blips) {
      expect(o.stoppedAt - o.startedAt).toBeLessThan(0.12)
      expect(o.stoppedAt - o.startedAt).toBeGreaterThanOrEqual(0.05)
    }
    const freqs = new Set(blips.map((o) => o.frequency.value))
    expect(freqs.size).toBe(1)
  })

  it("blip('select') is two quick rising notes, under 120ms overall", async () => {
    const radio = createRadio()
    await radio.start()
    const [ctx] = audio.contexts
    const before = ctx.of('oscillator').length
    radio.blip('select')
    const blips = ctx.of('oscillator').slice(before)
    const starts = [...new Set(blips.map((o) => o.startedAt))].sort((a, b) => a - b)
    expect(starts).toHaveLength(2)
    const first = blips.find((o) => o.startedAt === starts[0])
    const second = blips.find((o) => o.startedAt === starts[1])
    expect(second.frequency.value).toBeGreaterThan(first.frequency.value)
    const end = Math.max(...blips.map((o) => o.stoppedAt))
    expect(end - starts[0]).toBeLessThan(0.12)
  })

  it('blip nodes disconnect themselves when they end', async () => {
    const radio = createRadio()
    await radio.start()
    const [ctx] = audio.contexts
    const before = ctx.nodes.length
    radio.blip('select')
    const added = ctx.nodes.slice(before)
    // The fake fires onended synchronously from stop(); a real context fires it later.
    expect(added.every((n) => n.disconnected)).toBe(true)
  })

  it('suspend() and resume() drive the context and pause the chord timer', async () => {
    const radio = createRadio()
    await radio.start()
    const [ctx] = audio.contexts
    radio.suspend()
    expect(ctx.suspend).toHaveBeenCalled()
    const count = ctx.of('oscillator').length
    vi.advanceTimersByTime(60000)
    expect(ctx.of('oscillator').length).toBe(count)
    radio.resume()
    expect(ctx.resume).toHaveBeenCalledTimes(2)
    vi.advanceTimersByTime(8500)
    expect(ctx.of('oscillator').length).toBeGreaterThan(count)
  })

  it('a start() the browser blocks reports false after the cap, and later blips are dropped, not queued', async () => {
    audio.restore()
    audio = installFakeAudio({ blockResume: true })
    const radio = createRadio()
    const started = radio.start()
    await vi.advanceTimersByTimeAsync(450)
    await expect(started).resolves.toBe(false)
    const [ctx] = audio.contexts
    const before = ctx.of('oscillator').length
    radio.blip('move')
    radio.blip('select')
    expect(ctx.of('oscillator').length).toBe(before)

    // A later activation gesture retries; once running, blips sound again.
    ctx.blockResume = false
    await expect(radio.start()).resolves.toBe(true)
    expect(audio.Ctor).toHaveBeenCalledTimes(1)
    radio.blip('move')
    expect(ctx.of('oscillator').length).toBeGreaterThan(before)
  })

  it('keeps a blip fired in the same gesture as start(), before the resume settles', async () => {
    const radio = createRadio()
    const started = radio.start()
    const [ctx] = audio.contexts
    const before = ctx.of('oscillator').length
    radio.blip('move')
    expect(ctx.of('oscillator').length).toBeGreaterThan(before)
    await started
  })

  it('drops blips while suspended for a hidden tab', async () => {
    const radio = createRadio()
    await radio.start()
    const [ctx] = audio.contexts
    radio.suspend()
    const before = ctx.of('oscillator').length
    radio.blip('move')
    expect(ctx.of('oscillator').length).toBe(before)
  })

  it('calling start() again while playing only retries resume: no second pad, no re-fade', async () => {
    const radio = createRadio()
    await radio.start()
    const [ctx] = audio.contexts
    const nodes = ctx.nodes.length
    const ramps = masterOf(ctx).gain.events.length
    await radio.start()
    expect(ctx.resume).toHaveBeenCalledTimes(2)
    expect(ctx.nodes.length).toBe(nodes)
    expect(masterOf(ctx).gain.events.length).toBe(ramps)
  })

  it('reports the real context state to subscribers, including a resume that lands after the cap', async () => {
    audio.restore()
    audio = installFakeAudio({ blockResume: true })
    const radio = createRadio()
    const seen = []
    const unsubscribe = radio.subscribe((running) => seen.push(running))
    const started = radio.start()
    await vi.advanceTimersByTimeAsync(450)
    await expect(started).resolves.toBe(false)
    const [ctx] = audio.contexts

    ctx.setState('running') // the slow resume finally lands
    expect(seen).toEqual([true])
    const before = ctx.of('oscillator').length
    radio.blip('move')
    expect(ctx.of('oscillator').length).toBeGreaterThan(before)

    radio.suspend()
    expect(seen).toEqual([true, false])
    unsubscribe()
    ctx.blockResume = false
    radio.resume()
    expect(ctx.state).toBe('running')
    expect(seen).toEqual([true, false])
  })

  it('a torn-down context closing does not report to subscribers', async () => {
    const radio = createRadio()
    await radio.start()
    const seen = []
    radio.subscribe((running) => seen.push(running))
    radio.stop()
    vi.advanceTimersByTime(1500)
    expect(audio.contexts[0].close).toHaveBeenCalled()
    expect(seen).toEqual([])
  })

  it('is a silent no-op without Web Audio', async () => {
    delete window.AudioContext
    const radio = createRadio()
    await expect(radio.start()).resolves.toBe(false)
    expect(() => {
      radio.blip('move')
      radio.blip('select')
      radio.suspend()
      radio.resume()
      radio.stop()
    }).not.toThrow()
  })

  it('is a silent no-op when the AudioContext constructor throws', async () => {
    window.AudioContext = vi.fn(function () {
      throw new Error('blocked')
    })
    const radio = createRadio()
    await expect(radio.start()).resolves.toBe(false)
    expect(() => radio.blip('move')).not.toThrow()
  })

  it('falls back to webkitAudioContext', async () => {
    const Ctor = window.AudioContext
    delete window.AudioContext
    window.webkitAudioContext = Ctor
    try {
      const radio = createRadio()
      await expect(radio.start()).resolves.toBe(true)
      expect(Ctor).toHaveBeenCalledTimes(1)
    } finally {
      delete window.webkitAudioContext
    }
  })
})
