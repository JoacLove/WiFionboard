import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, PointerLockControls } from '@react-three/drei'
import * as THREE from 'three'
import { useViewerStore, type NavMode } from '../store/viewerStore'

function WalkKeys({ enabled }: { enabled: boolean }) {
  const { camera } = useThree()
  const keys = useRef<Record<string, boolean>>({})
  const velocity = useRef(new THREE.Vector3())

  useEffect(() => {
    if (!enabled) return
    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true
    }
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [enabled])

  useFrame((_, dt) => {
    if (!enabled) return
    const speed = keys.current.ShiftLeft || keys.current.ShiftRight ? 28 : 12
    const forward = new THREE.Vector3()
    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()
    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize()

    const wish = new THREE.Vector3()
    if (keys.current.KeyW || keys.current.ArrowUp) wish.add(forward)
    if (keys.current.KeyS || keys.current.ArrowDown) wish.sub(forward)
    if (keys.current.KeyD || keys.current.ArrowRight) wish.add(right)
    if (keys.current.KeyA || keys.current.ArrowLeft) wish.sub(right)
    if (keys.current.KeyE || keys.current.Space) wish.y += 1
    if (keys.current.KeyQ || keys.current.ControlLeft) wish.y -= 1

    if (wish.lengthSq() > 0) wish.normalize().multiplyScalar(speed)
    velocity.current.lerp(wish, 1 - Math.exp(-8 * dt))
    camera.position.addScaledVector(velocity.current, dt)
  })

  return null
}

function FlyKeys({ enabled }: { enabled: boolean }) {
  const { camera } = useThree()
  const keys = useRef<Record<string, boolean>>({})
  const look = useRef({ yaw: 0.4, pitch: -0.45 })
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!enabled) return
    // sync initial look from camera
    const e = new THREE.Euler().setFromQuaternion(camera.quaternion, 'YXZ')
    look.current = { yaw: e.y, pitch: e.x }

    const down = (e: KeyboardEvent) => {
      keys.current[e.code] = true
    }
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false
    }
    const md = (e: PointerEvent) => {
      if (e.button === 2 || e.button === 1) {
        dragging.current = true
        last.current = { x: e.clientX, y: e.clientY }
      }
    }
    const mu = () => {
      dragging.current = false
    }
    const mm = (e: PointerEvent) => {
      if (!dragging.current) return
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      last.current = { x: e.clientX, y: e.clientY }
      look.current.yaw -= dx * 0.004
      look.current.pitch -= dy * 0.004
      look.current.pitch = Math.max(-1.4, Math.min(1.4, look.current.pitch))
    }
    const ctx = (e: Event) => e.preventDefault()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('pointerdown', md)
    window.addEventListener('pointerup', mu)
    window.addEventListener('pointermove', mm)
    window.addEventListener('contextmenu', ctx)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('pointerdown', md)
      window.removeEventListener('pointerup', mu)
      window.removeEventListener('pointermove', mm)
      window.removeEventListener('contextmenu', ctx)
    }
  }, [enabled, camera])

  useFrame((_, dt) => {
    if (!enabled) return
    const { yaw, pitch } = look.current
    camera.quaternion.setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'))

    const speed = keys.current.ShiftLeft || keys.current.ShiftRight ? 45 : 18
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
    const up = new THREE.Vector3(0, 1, 0)
    const wish = new THREE.Vector3()
    if (keys.current.KeyW || keys.current.ArrowUp) wish.add(forward)
    if (keys.current.KeyS || keys.current.ArrowDown) wish.sub(forward)
    if (keys.current.KeyD || keys.current.ArrowRight) wish.add(right)
    if (keys.current.KeyA || keys.current.ArrowLeft) wish.sub(right)
    if (keys.current.KeyE || keys.current.Space) wish.add(up)
    if (keys.current.KeyQ || keys.current.ControlLeft) wish.sub(up)
    if (wish.lengthSq() > 0) {
      wish.normalize().multiplyScalar(speed * dt)
      camera.position.add(wish)
    }
  })

  return null
}

export function CameraRig() {
  const navMode = useViewerStore((s) => s.navMode) as NavMode

  return (
    <>
      {navMode === 'orbit' && (
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={8}
          maxDistance={320}
          maxPolarAngle={Math.PI * 0.49}
          target={[0, 12, 0]}
        />
      )}
      {navMode === 'walk' && (
        <>
          <PointerLockControls makeDefault />
          <WalkKeys enabled />
        </>
      )}
      {navMode === 'fly' && <FlyKeys enabled />}
    </>
  )
}
