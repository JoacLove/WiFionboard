import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DECKS, type DeckDef } from '../data/ship'

export type NavMode = 'orbit' | 'walk' | 'fly'
export type PlaceTool = 'select' | 'need' | 'ap'

export type MarkerKind = 'need' | 'ap'

export type Marker = {
  id: string
  kind: MarkerKind
  label: string
  deckId: string
  /** World position in meters */
  x: number
  y: number
  z: number
  /** Coverage radius in meters (AP only) */
  radius: number
  color: string
}

export type ExportPayload = {
  version: 1
  savedAt: string
  markers: Marker[]
  deckVisibility: Record<string, boolean>
  deckOpacity: Record<string, number>
}

type ViewerState = {
  navMode: NavMode
  tool: PlaceTool
  selectedId: string | null
  markers: Marker[]
  decks: DeckDef[]
  defaultApRadius: number
  showCoverage: boolean
  deckSpacing: number

  setNavMode: (m: NavMode) => void
  setTool: (t: PlaceTool) => void
  setSelectedId: (id: string | null) => void
  setDefaultApRadius: (r: number) => void
  setShowCoverage: (v: boolean) => void
  setDeckSpacing: (v: number) => void
  toggleDeck: (id: string) => void
  setDeckOpacity: (id: string, opacity: number) => void

  addMarker: (partial: Omit<Marker, 'id'>) => void
  updateMarker: (id: string, patch: Partial<Marker>) => void
  removeMarker: (id: string) => void
  clearMarkers: () => void

  exportJson: () => string
  importJson: (raw: string) => { ok: true } | { ok: false; error: string }
}

const NEED_COLOR = '#2f9e7b'
const AP_COLOR = '#e8a838'

let seq = 0
function uid(prefix: string) {
  seq += 1
  return `${prefix}-${Date.now().toString(36)}-${seq}`
}

export const useViewerStore = create<ViewerState>()(
  persist(
    (set, get) => ({
      navMode: 'orbit',
      tool: 'select',
      selectedId: null,
      markers: [],
      decks: DECKS.map((d) => ({ ...d })),
      defaultApRadius: 15,
      showCoverage: true,
      deckSpacing: 1,

      setNavMode: (navMode) => set({ navMode }),
      setTool: (tool) => set({ tool }),
      setSelectedId: (selectedId) => set({ selectedId }),
      setDefaultApRadius: (defaultApRadius) => set({ defaultApRadius }),
      setShowCoverage: (showCoverage) => set({ showCoverage }),
      setDeckSpacing: (deckSpacing) => set({ deckSpacing }),

      toggleDeck: (id) =>
        set((s) => ({
          decks: s.decks.map((d) =>
            d.id === id ? { ...d, visible: !d.visible } : d,
          ),
        })),

      setDeckOpacity: (id, opacity) =>
        set((s) => ({
          decks: s.decks.map((d) => (d.id === id ? { ...d, opacity } : d)),
        })),

      addMarker: (partial) => {
        const id = uid(partial.kind)
        const marker: Marker = { ...partial, id }
        set((s) => ({ markers: [...s.markers, marker], selectedId: id }))
      },

      updateMarker: (id, patch) =>
        set((s) => ({
          markers: s.markers.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),

      removeMarker: (id) =>
        set((s) => ({
          markers: s.markers.filter((m) => m.id !== id),
          selectedId: s.selectedId === id ? null : s.selectedId,
        })),

      clearMarkers: () => set({ markers: [], selectedId: null }),

      exportJson: () => {
        const s = get()
        const payload: ExportPayload = {
          version: 1,
          savedAt: new Date().toISOString(),
          markers: s.markers,
          deckVisibility: Object.fromEntries(s.decks.map((d) => [d.id, d.visible])),
          deckOpacity: Object.fromEntries(s.decks.map((d) => [d.id, d.opacity])),
        }
        return JSON.stringify(payload, null, 2)
      },

      importJson: (raw) => {
        try {
          const data = JSON.parse(raw) as ExportPayload
          if (!data || data.version !== 1 || !Array.isArray(data.markers)) {
            return { ok: false, error: 'Ugyldig filformat' }
          }
          set((s) => ({
            markers: data.markers,
            selectedId: null,
            decks: s.decks.map((d) => ({
              ...d,
              visible: data.deckVisibility?.[d.id] ?? d.visible,
              opacity: data.deckOpacity?.[d.id] ?? d.opacity,
            })),
          }))
          return { ok: true }
        } catch {
          return { ok: false, error: 'Kunne ikke lese JSON' }
        }
      },
    }),
    {
      name: 'hyperion-wifi-ga',
      partialize: (s) => ({
        markers: s.markers,
        decks: s.decks.map((d) => ({
          id: d.id,
          visible: d.visible,
          opacity: d.opacity,
        })),
        defaultApRadius: s.defaultApRadius,
        showCoverage: s.showCoverage,
        deckSpacing: s.deckSpacing,
        navMode: s.navMode,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<ViewerState> & {
          decks?: Array<{ id: string; visible?: boolean; opacity?: number }>
        }
        const deckPatch = new Map((p.decks ?? []).map((d) => [d.id, d]))
        return {
          ...current,
          ...p,
          decks: current.decks.map((d) => {
            const patch = deckPatch.get(d.id)
            return patch
              ? {
                  ...d,
                  visible: patch.visible ?? d.visible,
                  opacity: patch.opacity ?? d.opacity,
                }
              : d
          }),
          markers: p.markers ?? current.markers,
        }
      },
    },
  ),
)

export { NEED_COLOR, AP_COLOR }
