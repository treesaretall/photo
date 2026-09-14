import { describe, expect, it } from 'vitest'
import { calculateResizedDimensions } from './resizeImage'

describe('calculateResizedDimensions', () => {
  it('leaves dimensions unchanged when already within the max', () => {
    expect(calculateResizedDimensions(300, 200, 400)).toEqual({ width: 300, height: 200 })
  })

  it('scales down a landscape image to fit the max dimension', () => {
    expect(calculateResizedDimensions(4000, 2000, 1600)).toEqual({ width: 1600, height: 800 })
  })

  it('scales down a portrait image to fit the max dimension', () => {
    expect(calculateResizedDimensions(2000, 4000, 1600)).toEqual({ width: 800, height: 1600 })
  })

  it('scales down a square image to fit the max dimension', () => {
    expect(calculateResizedDimensions(3000, 3000, 400)).toEqual({ width: 400, height: 400 })
  })
})
