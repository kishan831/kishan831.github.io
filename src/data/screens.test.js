import { describe, it, expect } from 'vitest'
import { screens } from './screens'

describe('screens config', () => {
  it('exports nine screens', () => {
    expect(screens).toHaveLength(9)
  })
})
