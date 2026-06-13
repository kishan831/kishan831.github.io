import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'

const MINT = '#00d68a'
const GOLD = '#fca556'
const DARK = '#0e0e1b'

// Deterministic layout (no Math.random — keeps SSR/build reproducible)
const ITEMS = [
  { kind: 'coin', pos: [-3.4, 1.5, -1], scale: 1.05, color: GOLD, spin: 1.1 },
  { kind: 'chip', pos: [3.5, 1.9, -1.5], scale: 1.1, color: MINT, spin: 0.8 },
  { kind: 'die', pos: [2.7, -1.6, 0], scale: 0.9, color: DARK, spin: 1.3 },
  { kind: 'coin', pos: [3.9, -0.4, -2.5], scale: 0.8, color: GOLD, spin: 0.9 },
  { kind: 'chip', pos: [-3.9, -1.4, -1.5], scale: 0.85, color: MINT, spin: 1.0 },
  { kind: 'die', pos: [-2.6, 2.3, -2], scale: 0.7, color: DARK, spin: 1.2 },
  { kind: 'coin', pos: [0.6, 2.6, -3], scale: 0.7, color: GOLD, spin: 0.7 },
  { kind: 'chip', pos: [1.4, -2.4, -1], scale: 0.7, color: MINT, spin: 1.15 },
  { kind: 'coin', pos: [-1.5, -2.3, -2.5], scale: 0.6, color: GOLD, spin: 1.0 },
]

function Coin({ color, scale }) {
  return (
    <mesh rotation={[Math.PI / 2.3, 0, 0]} scale={scale} castShadow>
      <cylinderGeometry args={[0.5, 0.5, 0.09, 44]} />
      <meshStandardMaterial color={color} metalness={0.85} roughness={0.25} emissive={color} emissiveIntensity={0.06} />
    </mesh>
  )
}

function Chip({ color, scale }) {
  return (
    <mesh rotation={[Math.PI / 2.6, 0.3, 0]} scale={scale}>
      <cylinderGeometry args={[0.55, 0.55, 0.16, 36]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.35} emissive={color} emissiveIntensity={0.08} />
    </mesh>
  )
}

function Die({ color, scale }) {
  return (
    <RoundedBox args={[0.78, 0.78, 0.78]} radius={0.12} smoothness={3} scale={scale}>
      <meshStandardMaterial color={color} metalness={0.4} roughness={0.45} />
    </RoundedBox>
  )
}

function Item({ kind, ...props }) {
  if (kind === 'coin') return <Coin {...props} />
  if (kind === 'chip') return <Chip {...props} />
  return <Die {...props} />
}

function ParallaxGroup({ children }) {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const { x, y } = state.pointer
    // ease group toward pointer for a subtle depth effect
    ref.current.rotation.y += (x * 0.25 - ref.current.rotation.y) * 0.04
    ref.current.rotation.x += (-y * 0.18 - ref.current.rotation.x) * 0.04
  })
  return <group ref={ref}>{children}</group>
}

export default function HeroScene() {
  // Trim object count on small screens for performance
  const items = useMemo(() => {
    const isSmall = typeof window !== 'undefined' && window.innerWidth < 640
    return isSmall ? ITEMS.slice(0, 5) : ITEMS
  }, [])

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.55} />
      <pointLight position={[6, 4, 5]} intensity={55} color={MINT} />
      <pointLight position={[-6, -3, 4]} intensity={40} color={GOLD} />
      <pointLight position={[0, 0, 6]} intensity={18} color="#ffffff" />

      <ParallaxGroup>
        {items.map((it, i) => (
          <Float key={i} speed={1 + it.spin} rotationIntensity={1.1} floatIntensity={1.6} position={it.pos}>
            <Item kind={it.kind} color={it.color} scale={it.scale} />
          </Float>
        ))}
      </ParallaxGroup>
    </Canvas>
  )
}
