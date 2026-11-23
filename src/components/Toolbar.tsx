import { useRef } from 'react'
import { SHIP } from '../data/ship'
import { useViewerStore, type NavMode, type PlaceTool } from '../store/viewerStore'

const NAV: { id: NavMode; label: string; hint: string }[] = [
  { id: 'orbit', label: 'Orbit', hint: 'Dra for å rotere · rull for zoom' },
  { id: 'walk', label: 'Gå', hint: 'Klikk for å låse · WASD · Q/E høyde' },
  { id: 'fly', label: 'Fly', hint: 'WASD · Q/E · høyre-dra for å se' },
]

const TOOLS: { id: PlaceTool; label: string }[] = [
  { id: 'select', label: 'Velg' },
  { id: 'need', label: 'Behovssone' },
  { id: 'ap', label: 'Aksesspunkt' },
]

export function Toolbar() {
  const fileRef = useRef<HTMLInputElement>(null)
  const navMode = useViewerStore((s) => s.navMode)
  const tool = useViewerStore((s) => s.tool)
  const decks = useViewerStore((s) => s.decks)
  const markers = useViewerStore((s) => s.markers)
  const selectedId = useViewerStore((s) => s.selectedId)
  const showCoverage = useViewerStore((s) => s.showCoverage)
  const defaultApRadius = useViewerStore((s) => s.defaultApRadius)
  const deckSpacing = useViewerStore((s) => s.deckSpacing)

  const setNavMode = useViewerStore((s) => s.setNavMode)
  const setTool = useViewerStore((s) => s.setTool)
  const toggleDeck = useViewerStore((s) => s.toggleDeck)
  const setDeckOpacity = useViewerStore((s) => s.setDeckOpacity)
  const setShowCoverage = useViewerStore((s) => s.setShowCoverage)
  const setDefaultApRadius = useViewerStore((s) => s.setDefaultApRadius)
  const setDeckSpacing = useViewerStore((s) => s.setDeckSpacing)
  const updateMarker = useViewerStore((s) => s.updateMarker)
  const removeMarker = useViewerStore((s) => s.removeMarker)
  const clearMarkers = useViewerStore((s) => s.clearMarkers)
  const exportJson = useViewerStore((s) => s.exportJson)
  const importJson = useViewerStore((s) => s.importJson)

  const selected = markers.find((m) => m.id === selectedId) ?? null
  const navHint = NAV.find((n) => n.id === navMode)?.hint ?? ''

  function download() {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hyperion-wifi-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <aside className="panel">
      <header className="brand">
        <div className="brand-mark" aria-hidden />
        <div>
          <h1>Hyperion WiFi</h1>
          <p className="sub">
            {SHIP.name} · IMO {SHIP.imo}
          </p>
        </div>
      </header>

      <p className="sheet-note">{SHIP.sheet}</p>
      <p className="sheet-warn">{SHIP.note}</p>

      <section>
        <h2>Navigasjon</h2>
        <div className="seg">
          {NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              className={navMode === n.id ? 'active' : ''}
              onClick={() => setNavMode(n.id)}
            >
              {n.label}
            </button>
          ))}
        </div>
        <p className="hint">{navHint}</p>
      </section>

      <section>
        <h2>Plassering</h2>
        <div className="seg">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tool === t.id ? 'active' : ''}
              onClick={() => setTool(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="hint">
          {tool === 'select'
            ? 'Klikk markør for detaljer'
            : tool === 'need'
              ? 'Klikk på dekk for behovssone'
              : 'Klikk på dekk for aksesspunkt'}
        </p>
        <label className="row">
          <span>AP-radius (ny)</span>
          <input
            type="range"
            min={5}
            max={40}
            step={1}
            value={defaultApRadius}
            onChange={(e) => setDefaultApRadius(Number(e.target.value))}
          />
          <em>{defaultApRadius} m</em>
        </label>
        <label className="check">
          <input
            type="checkbox"
            checked={showCoverage}
            onChange={(e) => setShowCoverage(e.target.checked)}
          />
          Vis dekning / soner
        </label>
      </section>

      {selected && (
        <section className="selected">
          <h2>Valgt</h2>
          <label className="row">
            <span>Navn</span>
            <input
              type="text"
              value={selected.label}
              onChange={(e) => updateMarker(selected.id, { label: e.target.value })}
            />
          </label>
          <label className="row">
            <span>{selected.kind === 'ap' ? 'Radius' : 'Sone'}</span>
            <input
              type="range"
              min={3}
              max={50}
              step={1}
              value={selected.radius}
              onChange={(e) => updateMarker(selected.id, { radius: Number(e.target.value) })}
            />
            <em>{selected.radius} m</em>
          </label>
          <p className="meta">
            Dekk: {decks.find((d) => d.id === selected.deckId)?.label ?? selected.deckId}
          </p>
          <button type="button" className="danger" onClick={() => removeMarker(selected.id)}>
            Slett markør
          </button>
        </section>
      )}

      <section>
        <h2>Dekk</h2>
        <label className="row">
          <span>Avstand ×</span>
          <input
            type="range"
            min={0.6}
            max={3}
            step={0.1}
            value={deckSpacing}
            onChange={(e) => setDeckSpacing(Number(e.target.value))}
          />
          <em>{deckSpacing.toFixed(1)}</em>
        </label>
        <ul className="deck-list">
          {decks.map((d) => (
            <li key={d.id}>
              <label className="check">
                <input
                  type="checkbox"
                  checked={d.visible}
                  onChange={() => toggleDeck(d.id)}
                />
                <span>
                  {d.label} <small>{d.abl_m.toFixed(1)} m ABL</small>
                </span>
              </label>
              <input
                type="range"
                min={0.2}
                max={1}
                step={0.05}
                value={d.opacity}
                onChange={(e) => setDeckOpacity(d.id, Number(e.target.value))}
                aria-label={`Opasitet ${d.label}`}
              />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Lagring</h2>
        <p className="hint">
          Auto-lagres lokalt · {markers.length} markør{markers.length === 1 ? '' : 'er'}
        </p>
        <div className="actions">
          <button type="button" onClick={download}>
            Last ned JSON
          </button>
          <button type="button" onClick={() => fileRef.current?.click()}>
            Last opp JSON
          </button>
          <button
            type="button"
            className="danger"
            onClick={() => {
              if (confirm('Slette alle markører?')) clearMarkers()
            }}
          >
            Nullstill
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            const text = await file.text()
            const res = importJson(text)
            if (!res.ok) alert(res.error)
            e.target.value = ''
          }}
        />
      </section>
    </aside>
  )
}
