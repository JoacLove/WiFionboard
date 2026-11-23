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

/** All three GA sheets — decks registered CL-over-CL on a shared AP/LBP frame grid. */
export const SHIP: ShipMeta = {
  name: 'Ramform Hyperion',
  imo: '9676890',
  sheet: 'GB1-ZA0011(1/3–3/3)F — Below TT to platform',
  loa_m: 104.21,
  breadth_m: 70,
  note:
    'CL-alignment: sheets 2–3 share stern/bow crop + LOA→104.21 m scale; sheet 1 upper decks use frame-span scale and AP/LBP offsets (frame 0 ≈ stern).',
}

/**
 * Deck planes at A.B.L. heights. Texture v-center = ship CL (world z = offset[1]).
 * Full-hull decks (below-tt … deck4) share size/offset; sheet-1 decks are frame-registered.
 * Scene Y = ABL − BASE_ABL.
 */
export const DECKS: DeckDef[] = [
  {
    id: 'below-tt',
    label: 'Below Tank Top',
    abl_m: 1.0,
    file: '/decks/below-tt.png',
    size: [105.202, 69.473],
    offset: [0, 0],
    visible: true,
    opacity: 0.82,
  },
  {
    id: 'tank-top',
    label: 'Tank Top',
    abl_m: 3.6,
    file: '/decks/tank-top.png',
    size: [105.202, 69.473],
    offset: [0, 0],
    visible: true,
    opacity: 0.84,
  },
  {
    id: 'deck1',
    label: 'Dekk 1',
    abl_m: 8.1,
    file: '/decks/deck1.png',
    size: [105.202, 69.473],
    offset: [0, 0],
    visible: true,
    opacity: 0.86,
  },
  {
    id: 'deck2',
    label: 'Dekk 2',
    abl_m: 11.1,
    file: '/decks/deck2.png',
    size: [105.202, 69.473],
    offset: [0, 0],
    visible: true,
    opacity: 0.88,
  },
  {
    id: 'deck3',
    label: 'Dekk 3',
    abl_m: 14.2,
    file: '/decks/deck3.png',
    size: [105.202, 69.473],
    offset: [0, 0],
    visible: true,
    opacity: 0.88,
  },
  {
    id: 'deck4',
    label: 'Dekk 4',
    abl_m: 17.6,
    file: '/decks/deck4.png',
    size: [105.202, 69.473],
    offset: [0, 0],
    visible: true,
    opacity: 0.9,
  },
  {
    id: 'deck5',
    label: 'Dekk 5',
    abl_m: 21.1,
    file: '/decks/deck5.png',
    size: [52.096, 69.853],
    offset: [-26.754, 0],
    visible: true,
    opacity: 0.92,
  },
  {
    id: 'deck6',
    label: 'Dekk 6',
    abl_m: 24.05,
    file: '/decks/deck6.png',
    size: [48.501, 16.077],
    offset: [-28.165, 0],
    visible: true,
    opacity: 0.9,
  },
  {
    id: 'bridge',
    label: 'Brudekk',
    abl_m: 26.8,
    file: '/decks/bridge.png',
    size: [19.562, 15.831],
    offset: [-19.853, 0],
    visible: true,
    opacity: 0.9,
  },
  {
    id: 'jib-platform',
    label: 'Jib-plattform',
    abl_m: 27.3,
    file: '/decks/jib-platform.png',
    size: [22.507, 7.838],
    offset: [-37.641, 0],
    visible: true,
    opacity: 0.75,
  },
  {
    id: 'top-bridge',
    label: 'Topp bru',
    abl_m: 29.7,
    file: '/decks/top-bridge.png',
    size: [8.552, 9.467],
    offset: [-19.12, 0],
    visible: true,
    opacity: 0.88,
  },
  {
    id: 'targa',
    label: 'Targa-dekk',
    abl_m: 33.1,
    file: '/decks/targa.png',
    size: [6.65, 11.192],
    offset: [-19.965, 0],
    visible: true,
    opacity: 0.85,
  },
  {
    id: 'platform',
    label: 'Nedre plattform',
    abl_m: 36.5,
    file: '/decks/platform.png',
    size: [4.494, 5.224],
    offset: [-19.04, 0],
    visible: true,
    opacity: 0.85,
  },
]

/** Scene Y origin = Below Tank Top. */
export const BASE_ABL = 1.0

export function deckY(abl_m: number) {
  return abl_m - BASE_ABL
}
