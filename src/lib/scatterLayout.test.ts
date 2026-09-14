import { describe, expect, it } from 'vitest'
import { getScatterRows } from './scatterLayout'

describe('getScatterRows', () => {
  it('returns no rows for zero photos', () => {
    expect(getScatterRows(0)).toEqual([])
  })

  it('returns rows whose slots add up to exactly the requested photo count', () => {
    for (const count of [1, 2, 3, 5, 34, 35, 36, 70]) {
      const rows = getScatterRows(count)
      const total = rows.reduce((sum, row) => sum + row.length, 0)
      expect(total).toBe(count)
    }
  })

  it('never produces an empty row', () => {
    const rows = getScatterRows(37)
    for (const row of rows) {
      expect(row.length).toBeGreaterThan(0)
    }
  })

  it('gives every slot desktop offsets scoped to viewport units', () => {
    const rows = getScatterRows(5)
    for (const row of rows) {
      for (const slot of row) {
        expect(slot.desktop.width).toMatch(/%$/)
        expect(slot.desktop.marginTop).toMatch(/vh$/)
        expect(slot.desktop.marginLeft).toMatch(/vw$/)
      }
    }
  })

  it('gives every slot a distinct mobile offset (not a plain full-width stack)', () => {
    const rows = getScatterRows(5)
    for (const row of rows) {
      for (const slot of row) {
        expect(slot.mobile.width).not.toBe('100%')
        expect(slot.mobile.width.length).toBeGreaterThan(0)
        expect(slot.mobile.marginLeft.length).toBeGreaterThan(0)
      }
    }
  })
})
