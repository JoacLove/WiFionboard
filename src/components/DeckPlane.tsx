import { useMemo, useRef } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { deckY, type DeckDef } from '../data/ship'
import { useViewerStore, NEED_COLOR, AP_COLOR } from '../store/viewerStore'

type Props = {
  deck: DeckDef
}

export function DeckPlane({ deck }: Props) {
  const texture = useTexture(deck.file)
  const meshRef = useRef<THREE.Mesh>(null)
  const tool = useViewerStore((s) => s.tool)
  const spacing = useViewerStore((s) => s.deckSpacing)
  const defaultApRadius = useViewerStore((s) => s.defaultApRadius)
  const addMarker = useViewerStore((s) => s.addMarker)

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    texture.needsUpdate = true
  }, [texture])

  if (!deck.visible) return null

  const y = deckY(deck.abl_m) * spacing
  const [len, beam] = deck.size
  const [ox, oz] = deck.offset

  return (
    <mesh
      ref={meshRef}
      name={`deck-${deck.id}`}
      position={[ox, y, oz]}
      rotation={[-Math.PI / 2, 0, 0]}
      userData={{ deckId: deck.id, abl: deck.abl_m }}
      onClick={(e) => {
        e.stopPropagation()
        if (tool !== 'need' && tool !== 'ap') return
        const p = e.point
        const kind = tool
        const nNeed = useViewerStore.getState().markers.filter((m) => m.kind === 'need').length
        const nAp = useViewerStore.getState().markers.filter((m) => m.kind === 'ap').length
        addMarker({
          kind,
          label: kind === 'need' ? `Behov ${nNeed + 1}` : `AP ${nAp + 1}`,
          deckId: deck.id,
          x: p.x,
          y: p.y + 0.15,
          z: p.z,
          radius: kind === 'ap' ? defaultApRadius : 8,
          color: kind === 'need' ? NEED_COLOR : AP_COLOR,
        })
      }}
      onPointerOver={(e) => {
        if (tool === 'need' || tool === 'ap') {
          e.stopPropagation()
          document.body.style.cursor = 'crosshair'
        }
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default'
      }}
    >
      <planeGeometry args={[len, beam]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={deck.opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        alphaTest={0.02}
      />
    </mesh>
  )
}
