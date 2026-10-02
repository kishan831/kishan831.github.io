import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { act } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { installFakeAudio } from './test/fakeAudioContext'

// The real engine against a spying AudioContext: nothing may touch Web Audio
// until the visitor opts in. Modules are reset per test so each one gets a
// fresh engine singleton.
let audio
let App
let radio
beforeEach(async () => {
  vi.resetModules()
  audio = installFakeAudio()
  App = (await import('./App')).default
  radio = (await import('./audio/radio')).radio
})
afterEach(() => {
  radio.stop()
  audio.restore()
})

describe('App — no audio before opt-in', () => {
  it('constructs no AudioContext on load, nor on clicks while OFF', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('tab', { name: /skills/i }))
    expect(audio.Ctor).not.toHaveBeenCalled()
  })

  it('constructs the AudioContext when the toggle is pressed', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /kj-fm.*radio/i }))
    expect(audio.Ctor).toHaveBeenCalledTimes(1)
  })

  it('with a remembered ON, constructs nothing until the first gesture', async () => {
    window.localStorage.setItem('kj-radio', 'on')
    render(<App />)
    expect(audio.Ctor).not.toHaveBeenCalled()
    await act(async () => fireEvent.pointerDown(document.body, { pointerType: 'mouse' }))
    expect(audio.Ctor).toHaveBeenCalledTimes(1)
  })
})
