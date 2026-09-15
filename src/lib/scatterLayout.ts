export interface ScatterOffsets {
  width: string
  marginTop: string
  marginLeft: string
  marginBottom?: string
}

export interface ScatterSlot {
  desktop: ScatterOffsets
  mobile: ScatterOffsets
}

/**
 * Scales down the vh magnitudes below before use. The raw values were
 * ported from a reference site tuned for its own specific (mostly tall)
 * photos; against arbitrary real photos they read as heavy collisions
 * rather than a stylistic overlap, so the pool is toned down considerably
 * while keeping each preset's relative character.
 */
const DESKTOP_OFFSET_SCALE = 0.4
const MOBILE_OFFSET_SCALE = 0.5

function scaleVh(value: string, factor: number): string {
  if (!value.endsWith('vh')) {
    return value
  }
  const scaled = Math.round(Number.parseFloat(value) * factor * 10) / 10
  return `${scaled}vh`
}

function scaleOffsets(offsets: ScatterOffsets, factor: number): ScatterOffsets {
  return {
    ...offsets,
    marginTop: scaleVh(offsets.marginTop, factor),
    marginBottom: offsets.marginBottom ? scaleVh(offsets.marginBottom, factor) : undefined,
  }
}

/**
 * Desktop position/size presets modeled on ekaterinabusygina.com's hand-tuned
 * photo layout (each photo offset by an arbitrary vw/vh margin, some negative
 * to create overlap between rows). Cycling through this pool by photo index
 * reproduces that scattered, asymmetric composition for any number of photos.
 * (Raw magnitudes below get scaled down by DESKTOP_OFFSET_SCALE before use.)
 */
const DESKTOP_PRESETS_RAW: ScatterOffsets[] = [
  { width: '18%', marginTop: '0vh', marginLeft: '26vw' },
  { width: '25%', marginTop: '26vh', marginLeft: '14vw' },
  { width: '24%', marginTop: '-24vh', marginLeft: '6vw' },
  { width: '40%', marginTop: '22vh', marginLeft: '23vw' },
  { width: '28%', marginTop: '-32vh', marginLeft: '12vw' },
  { width: '25%', marginTop: '5vh', marginLeft: '53vw' },
  { width: '28%', marginTop: '30vh', marginLeft: '8vw' },
  { width: '30%', marginTop: '-35vh', marginLeft: '6vw' },
  { width: '39%', marginTop: '20vh', marginLeft: '10vw' },
  { width: '30%', marginTop: '25vh', marginLeft: '20vw' },
  { width: '30%', marginTop: '20vh', marginLeft: '18vw' },
  { width: '22%', marginTop: '-28vh', marginLeft: '16vw' },
  { width: '19%', marginTop: '20vh', marginLeft: '16vw' },
  { width: '34%', marginTop: '22vh', marginLeft: '8vw' },
  { width: '24%', marginTop: '14vh', marginLeft: '12vw' },
  { width: '23%', marginTop: '60vh', marginLeft: '-6vw' },
  { width: '19%', marginTop: '30vh', marginLeft: '20vw' },
  { width: '28%', marginTop: '16vh', marginLeft: '14vw' },
  { width: '21%', marginTop: '20vh', marginLeft: '8vw' },
  { width: '24%', marginTop: '20vh', marginLeft: '24vw' },
  { width: '54%', marginTop: '20vh', marginLeft: '12vw', marginBottom: '20vh' },
  { width: '15%', marginTop: '35vh', marginLeft: '4vw' },
  { width: '27%', marginTop: '-20vh', marginLeft: '10vw' },
  { width: '42%', marginTop: '20vh', marginLeft: '16vw' },
  { width: '31%', marginTop: '16vh', marginLeft: '22vw' },
  { width: '26%', marginTop: '40vh', marginLeft: '4vw' },
  { width: '57%', marginTop: '32vh', marginLeft: '10vw' },
  { width: '22%', marginTop: '18vh', marginLeft: '7vw' },
  { width: '25%', marginTop: '18vh', marginLeft: '18vw' },
  { width: '30%', marginTop: '28vh', marginLeft: '10vw' },
  { width: '34%', marginTop: '18vh', marginLeft: '19vw', marginBottom: '10vh' },
  { width: '22%', marginTop: '6vh', marginLeft: '10vw' },
  { width: '23%', marginTop: '-40vh', marginLeft: '5vw' },
  { width: '19%', marginTop: '14vh', marginLeft: '42vw' },
  { width: '48%', marginTop: '-20vh', marginLeft: '10vw' },
]

/**
 * Mobile (<=480px) counterparts, ported from the reference site's own
 * @media (max-width: 480px) overrides — a separate, smaller-scale scattered
 * layout, not a plain single-column stack. Presets with no reference
 * override (A7, A11, A18, A28) fall back to their desktop offsets.
 * (Raw magnitudes below get scaled down by MOBILE_OFFSET_SCALE before use.)
 */
const MOBILE_PRESETS_RAW: ScatterOffsets[] = [
  { width: '30%', marginTop: '8vh', marginLeft: '15vw' },
  { width: '39%', marginTop: '25vh', marginLeft: '14vw' },
  { width: '34%', marginTop: '-4vh', marginLeft: '1vw' },
  { width: '65%', marginTop: '18vh', marginLeft: '-12%' },
  { width: '35%', marginTop: '8vh', marginLeft: '0' },
  { width: '42%', marginTop: '-5vh', marginLeft: '55vw' },
  DESKTOP_PRESETS_RAW[6],
  { width: '36%', marginTop: '-5vh', marginLeft: '5vw' },
  { width: '40%', marginTop: '28vh', marginLeft: '5vw' },
  { width: '51%', marginTop: '13vh', marginLeft: '12vw' },
  { width: '44%', marginTop: '10vh', marginLeft: '16vw' },
  DESKTOP_PRESETS_RAW[11],
  { width: '27%', marginTop: '27.5vh', marginLeft: '8vw' },
  { width: '44%', marginTop: '22vh', marginLeft: '2vw' },
  { width: '29%', marginTop: '12vh', marginLeft: '8vw' },
  { width: '32%', marginTop: '33vh', marginLeft: '-16vw' },
  { width: '30%', marginTop: '19vh', marginLeft: '9vw' },
  { width: '44%', marginTop: '10vh', marginLeft: '10vw' },
  DESKTOP_PRESETS_RAW[18],
  { width: '40%', marginTop: '20vh', marginLeft: '24vw' },
  { width: '81%', marginTop: '30vh', marginLeft: '-13vw', marginBottom: '5vh' },
  { width: '28%', marginTop: '-3vh', marginLeft: '1vw' },
  { width: '38%', marginTop: '-12vh', marginLeft: '6vw' },
  { width: '60%', marginTop: '10.5vh', marginLeft: '8vw' },
  { width: '40%', marginTop: '28vh', marginLeft: '21vw' },
  { width: '39%', marginTop: '10.5vh', marginLeft: '1vw' },
  { width: '62%', marginTop: '28vh', marginLeft: '1vw' },
  { width: '35%', marginTop: '6vh', marginLeft: '-6vw' },
  DESKTOP_PRESETS_RAW[28],
  { width: '40%', marginTop: '26vh', marginLeft: '10vw' },
  { width: '35%', marginTop: '14vh', marginLeft: '14vw', marginBottom: '10vh' },
  { width: '30%', marginTop: '39vh', marginLeft: '1vw' },
  { width: '40%', marginTop: '12vh', marginLeft: '19vw' },
  { width: '30%', marginTop: '12vh', marginLeft: 'auto' },
  { width: '80%', marginTop: '14vh', marginLeft: '1vw', marginBottom: '5vh' },
]

const DESKTOP_PRESETS: ScatterOffsets[] = DESKTOP_PRESETS_RAW.map((offsets) =>
  scaleOffsets(offsets, DESKTOP_OFFSET_SCALE),
)
const MOBILE_PRESETS: ScatterOffsets[] = MOBILE_PRESETS_RAW.map((offsets) =>
  scaleOffsets(offsets, MOBILE_OFFSET_SCALE),
)

const PRESETS: ScatterSlot[] = DESKTOP_PRESETS.map((desktop, index) => ({
  desktop,
  mobile: MOBILE_PRESETS[index],
}))

/**
 * Splits a marginTop value into a real (always non-negative) flow margin and
 * a visual-only offset. A negative margin-top on a flex item can shrink that
 * item's margin-box height below zero, which collapses the row's rendered
 * height toward zero and causes the next row to start at the same position —
 * i.e. photos stacking on top of each other. That risk scales with how tall
 * the photo actually renders, which depends on its real aspect ratio and is
 * unknowable in advance (and is shortest, relatively, on narrow mobile
 * viewports). Real margin can only ever add height, so it's safe; negative
 * pull is applied via `transform` instead, which never affects layout.
 */
export function splitVerticalOffset(marginTop: string): { flowMarginTop: string; visualOffsetY: string } {
  if (marginTop.startsWith('-')) {
    return { flowMarginTop: '0vh', visualOffsetY: marginTop }
  }
  return { flowMarginTop: marginTop, visualOffsetY: '0vh' }
}

/** Number of photos per row, cycled alongside the presets above. */
const ROW_SLOT_COUNTS = [2, 2, 1, 1, 1, 2, 2, 2, 1, 2, 3, 2, 2, 2, 1, 2, 2, 1, 2, 2]

function buildRowTemplates(): ScatterSlot[][] {
  const rows: ScatterSlot[][] = []
  let cursor = 0
  for (const slotCount of ROW_SLOT_COUNTS) {
    rows.push(PRESETS.slice(cursor, cursor + slotCount))
    cursor += slotCount
  }
  return rows
}

const ROW_TEMPLATES = buildRowTemplates()

/**
 * Returns rows of scatter slots that together contain exactly `photoCount`
 * slots, cycling through ROW_TEMPLATES as many times as needed.
 */
export function getScatterRows(photoCount: number): ScatterSlot[][] {
  const rows: ScatterSlot[][] = []
  let remaining = photoCount
  let templateIndex = 0

  while (remaining > 0) {
    const template = ROW_TEMPLATES[templateIndex % ROW_TEMPLATES.length]
    const row = template.slice(0, remaining)
    rows.push(row)
    remaining -= row.length
    templateIndex += 1
  }

  return rows
}
