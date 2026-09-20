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
