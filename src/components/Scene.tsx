import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, Grid } from '@react-three/drei'
import { DeckPlane } from './DeckPlane'
import { Markers } from './Markers'
import { CameraRig } from './CameraRig'
import { useViewerStore } from '../store/viewerStore'

function Decks() {
  const decks = useViewerStore((s) => s.decks)
  return (
    <>
      {decks.map((d) => (
        <DeckPlane key={d.id} deck={d} />
      ))}
    </>
  )
}

export function Scene() {
  const setSelectedId = useViewerStore((s) => s.setSelectedId)

  return (
    <Canvas
      className="scene-canvas"
      shadows
      camera={{ position: [70, 55, 90], fov: 42, near: 0.5, far: 800 }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => setSelectedId(null)}
    >
      <color attach="background" args={['#071018']} />
      <fog attach="fog" args={['#071018', 120, 380]} />

      <ambientLight intensity={0.55} />
      <directionalLight
        position={[40, 80, 30]}
        intensity={1.15}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight args={['#b8d4e8', '#1a2a1a', 0.35]} />

      <Suspense fallback={null}>
        <Decks />
        <Markers />
        <Environment preset="city" environmentIntensity={0.25} />
      </Suspense>

      <Grid
        position={[0, -0.02, 0]}
        args={[200, 200]}
        cellSize={5}
        cellThickness={0.6}
        cellColor="#1c3348"
        sectionSize={20}
        sectionThickness={1.1}
        sectionColor="#2a4d6a"
        fadeDistance={220}
        fadeStrength={1.2}
        infiniteGrid
      />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.35} scale={180} blur={2.5} far={40} />

      <CameraRig />
    </Canvas>
  )
}
