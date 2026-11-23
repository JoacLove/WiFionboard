import { Html } from '@react-three/drei'
import { useViewerStore, type Marker } from '../store/viewerStore'

function MarkerMesh({ marker }: { marker: Marker }) {
  const selectedId = useViewerStore((s) => s.selectedId)
  const setSelectedId = useViewerStore((s) => s.setSelectedId)
  const showCoverage = useViewerStore((s) => s.showCoverage)
  const selected = selectedId === marker.id

  return (
    <group position={[marker.x, marker.y, marker.z]}>
      {marker.kind === 'ap' ? (
        <mesh
          onClick={(e) => {
            e.stopPropagation()
            setSelectedId(marker.id)
          }}
        >
          <sphereGeometry args={[0.55, 20, 16]} />
          <meshStandardMaterial
            color={marker.color}
            emissive={marker.color}
            emissiveIntensity={selected ? 0.55 : 0.25}
            roughness={0.35}
          />
        </mesh>
      ) : (
        <mesh
          onClick={(e) => {
            e.stopPropagation()
            setSelectedId(marker.id)
          }}
        >
          <cylinderGeometry args={[0.7, 0.7, 0.25, 24]} />
          <meshStandardMaterial
            color={marker.color}
            emissive={marker.color}
            emissiveIntensity={selected ? 0.45 : 0.2}
            roughness={0.4}
          />
        </mesh>
      )}

      {marker.kind === 'ap' && showCoverage && (
        <mesh>
          <sphereGeometry args={[marker.radius, 32, 24]} />
          <meshStandardMaterial
            color={marker.color}
            transparent
            opacity={selected ? 0.22 : 0.12}
            depthWrite={false}
            roughness={1}
          />
        </mesh>
      )}

      {marker.kind === 'need' && showCoverage && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <ringGeometry args={[marker.radius * 0.85, marker.radius, 48]} />
          <meshBasicMaterial
            color={marker.color}
            transparent
            opacity={selected ? 0.55 : 0.35}
            side={2}
            depthWrite={false}
          />
        </mesh>
      )}

      <Html distanceFactor={40} style={{ pointerEvents: 'none' }} center position={[0, 1.2, 0]}>
        <div className={`marker-label ${selected ? 'selected' : ''}`}>{marker.label}</div>
      </Html>
    </group>
  )
}

export function Markers() {
  const markers = useViewerStore((s) => s.markers)
  return (
    <>
      {markers.map((m) => (
        <MarkerMesh key={m.id} marker={m} />
      ))}
    </>
  )
}
