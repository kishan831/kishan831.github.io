import { vi } from 'vitest'

/**
 * Just enough of the Web Audio API for the radio engine to build, schedule and
 * tear down its graph under jsdom (which has no Web Audio). Every node records
 * what was done to it so tests can assert on the graph, not on sound.
 */
class FakeParam {
  constructor(value = 0) {
    this.value = value
    this.events = []
  }
  setValueAtTime(v, t) { this.events.push(['set', v, t]); return this }
  linearRampToValueAtTime(v, t) { this.events.push(['linear', v, t]); return this }
  exponentialRampToValueAtTime(v, t) { this.events.push(['exp', v, t]); return this }
  setTargetAtTime(v, t, c) { this.events.push(['target', v, t, c]); return this }
  cancelScheduledValues(t) { this.events.push(['cancel', t]); return this }
}

class FakeNode {
  constructor(ctx, kind) {
    this.context = ctx
    this.kind = kind
    this.connections = []
    this.disconnected = false
    ctx.nodes.push(this)
  }
  connect(target) {
    this.connections.push(target)
    return target
  }
  disconnect() {
    this.disconnected = true
    this.connections = []
  }
}

class FakeSource extends FakeNode {
  start(t = 0) { this.startedAt = t }
  stop(t = 0) {
    this.stoppedAt = t
    this.onended?.()
  }
}

export class FakeAudioContext {
  constructor() {
    this.nodes = []
    this.currentTime = 0
    this.sampleRate = 8000
    this.state = 'suspended'
    this.destination = new FakeNode(this, 'destination')
    this.resume = vi.fn(() => {
      this.state = 'running'
      return Promise.resolve()
    })
    this.suspend = vi.fn(() => {
      this.state = 'suspended'
      return Promise.resolve()
    })
    this.close = vi.fn(() => {
      this.state = 'closed'
      return Promise.resolve()
    })
  }
  createGain() {
    const n = new FakeNode(this, 'gain')
    n.gain = new FakeParam(1)
    return n
  }
  createOscillator() {
    const n = new FakeSource(this, 'oscillator')
    n.type = 'sine'
    n.frequency = new FakeParam(440)
    n.detune = new FakeParam(0)
    return n
  }
  createBiquadFilter() {
    const n = new FakeNode(this, 'biquad')
    n.type = 'lowpass'
    n.frequency = new FakeParam(350)
    n.Q = new FakeParam(1)
    n.gain = new FakeParam(0)
    return n
  }
  createBufferSource() {
    const n = new FakeSource(this, 'bufferSource')
    n.buffer = null
    n.loop = false
    n.playbackRate = new FakeParam(1)
    return n
  }
  createBuffer(channels, length, sampleRate) {
    const data = Array.from({ length: channels }, () => new Float32Array(length))
    return { numberOfChannels: channels, length, sampleRate, getChannelData: (c) => data[c] }
  }
  // Helpers for assertions.
  of(kind) {
    return this.nodes.filter((n) => n.kind === kind)
  }
  sources() {
    return this.nodes.filter((n) => n instanceof FakeSource)
  }
}

/** Installs a spying AudioContext constructor on window; returns the spy and created contexts. */
export function installFakeAudio() {
  const contexts = []
  const Ctor = vi.fn(function AudioContext() {
    const ctx = new FakeAudioContext()
    contexts.push(ctx)
    return ctx
  })
  const previous = window.AudioContext
  window.AudioContext = Ctor
  return {
    Ctor,
    contexts,
    restore() {
      if (previous === undefined) delete window.AudioContext
      else window.AudioContext = previous
    },
  }
}
