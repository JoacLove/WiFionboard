export type DeckDef = {
  id: string
  label: string
  abl_m: number
  file: string
  /** World size of the texture plane in meters [length X, beam Z] */
  size: [number, number]
  /** World-space center offset [x, z] relative to ship origin */
  offset: [number, number]
  visible: boolean
  opacity: number
}

export type ShipMeta = {
  name: string
  imo: string
  sheet: string
  loa_m: number
  breadth_m: number
  note: string
}

/** Sheet 1/3 only — Deck 5 & above. Lower decks missing from source PDF. */
export const SHIP: ShipMeta = {
  name: 'Ramform Hyperion',
  imo: '9676890',
  sheet: 'GB1-ZA0011(1/3)F — Deck 5 & above',
  loa_m: 104.21,
  breadth_m: 70,
  note: 'Kun ark 1/3 i PDF. Dekk 4 og ned mangler.',
}

/**
 * Plan crops from the GA sheet, stacked at A.B.L. heights.
 * Size/offset are approximate — tuned so frames roughly align for planning.
 * Y in the scene = ABL − 21.1 m (Dekk 5 as floor).
 */
export const DECKS: DeckDef[] = [
  {
    id: 'deck5',
    label: 'Dekk 5',
    abl_m: 21.1,
    file: '/decks/deck5.png',
    size: [118, 72],
    offset: [0, 0],
    visible: true,
    opacity: 0.92,
  },
  {
    id: 'deck6',
    label: 'Dekk 6',
    abl_m: 24.05,
    file: '/decks/deck6.png',
    size: [78, 58],
    offset: [-8, 0],
    visible: true,
    opacity: 0.88,
  },
  {
    id: 'bridge',
    label: 'Brudekk',
    abl_m: 26.8,
    file: '/decks/bridge.png',
    size: [42, 22],
    offset: [12, 0],
    visible: true,
    opacity: 0.9,
  },
  {
    id: 'top-bridge',
    label: 'Topp bru',
    abl_m: 29.7,
    file: '/decks/top-bridge.png',
    size: [36, 20],
    offset: [14, 0],
    visible: true,
    opacity: 0.85,
  },
  {
    id: 'targa',
    label: 'Targa-dekk',
    abl_m: 33.1,
    file: '/decks/targa.png',
    size: [18, 16],
    offset: [18, 0],
    visible: true,
    opacity: 0.85,
  },
  {
    id: 'platform',
    label: 'Nedre plattform',
    abl_m: 36.5,
    file: '/decks/platform.png',
    size: [12, 12],
    offset: [20, 0],
    visible: true,
    opacity: 0.85,
  },
]

export const BASE_ABL = 21.1

export function deckY(abl_m: number) {
  return abl_m - BASE_ABL
}
