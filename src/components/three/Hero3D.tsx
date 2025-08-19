
// === src/components/three/Hero3D.tsx ===
/**
 * SETUP GUIDE (5 steps)
 * STEP 1: Install @react-three/fiber @react-three/drei three
 * STEP 2: Set NEXT_PUBLIC_ENABLE_3D="true" in .env.local
 * STEP 3: Test WebGL support in target browsers
 * STEP 4: Configure performance settings based on device
 * STEP 5: Add fallback for WebGL unsupported devices
 * NOTE: Dynamic import with SSR disabled for 3D canvas
 * TODO: Add more interactive 3D elements
 */

'use client'

import { Suspense, useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

// BEGINNER: Set NEXT_PUBLIC_ENABLE_3D="true" in .env.local to enable 3D hero

interface ParticleSystemProps {
  count: number
}

function ParticleSystem({ count }: ParticleSystemProps) {
  const mesh = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      // Position particles in sphere
      const radius = Math.random() * 5 + 2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Gradient colors
      colors[i * 3] = 0.3 + Math.random() * 0.4 // R
      colors[i * 3 + 1] = 0.4 + Math.random() * 0.4 // G
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2 // B
    }
    
    return { positions, colors }
  }, [count])
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
      mesh.current.rotation.y += 0.002
    }
  })
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function MainSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { mouse, viewport } = useThree()
  
  useFrame((state) => {
    if (meshRef.current) {
      // Pointer parallax with constraints
      const targetRotationX = (mouse.y * viewport.height) / 10
      const targetRotationY = (mouse.x * viewport.width) / 10
      
      // PERF: Clamp rotation to prevent excessive movement
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        THREE.MathUtils.clamp(targetRotationX, -0.3, 0.3),
        0.02
      )
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        THREE.MathUtils.clamp(targetRotationY, -0.3, 0.3),
        0.02
      )
      
      // Subtle floating animation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })
  
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1.5, 32, 32]} scale={1}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

function Scene() {
  const [particleCount, setParticleCount] = useState(300)
  
  useEffect(() => {
    // PERF: Adjust particle count based on device performance
    const checkDevicePerformance = () => {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl')
      
      if (!gl) return 80 // Fallback for no WebGL
      
      // Check device memory (Chrome only)
      const memory = (navigator as any).deviceMemory
      if (memory && memory < 4) return 150
      
      // Check screen size
      const { width, height } = window.screen
      const pixels = width * height
      
      if (pixels > 2073600) return 600 // Desktop
      if (pixels > 921600) return 300 // Laptop
      return 80 // Mobile
    }
    
    setParticleCount(checkDevicePerformance())
  }, [])
  
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      
      {/* Directional light with soft shadows */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Rim light */}
      <directionalLight
        position={[-5, -5, -5]}
        intensity={0.3}
        color="#8b5cf6"
      />
      
      {/* Main 3D elements */}
      <MainSphere />
      <ParticleSystem count={particleCount} />
    </>
  )
}

// WebGL availability check
function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!context
  } catch {
    return false
  }
}

// Animated SVG fallback
function AnimatedSVGFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg">
      <svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        className="animate-pulse"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <circle
          cx="150"
          cy="150"
          r="80"
          fill="url(#grad1)"
          filter="url(#glow)"
          className="animate-float"
        />
        
        {/* Orbital particles */}
        {[...Array(8)].map((_, i) => (
          <circle
            key={i}
            cx={150 + Math.cos(i * Math.PI / 4) * 120}
            cy={150 + Math.sin(i * Math.PI / 4) * 120}
            r="3"
            fill="#6366f1"
            opacity="0.6"
            className="animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '2s',
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export default function Hero3D() {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  
  useEffect(() => {
    // Check WebGL support
    setWebGLSupported(checkWebGLSupport())
    
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  
  // ACCESSIBILITY: Respect user's motion preferences
  if (reducedMotion || process.env.NEXT_PUBLIC_REDUCED_MOTION === 'true') {
    return <AnimatedSVGFallback />
  }
  
  if (webGLSupported === false) {
    return <AnimatedSVGFallback />
  }
  
  if (webGLSupported === null) {
    // Loading state
    return (
      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg animate-pulse" />
    )
  }
  
  return (
    <div className="w-full h-full">
      <Canvas
        dpr={[1, 2]} // PERF: Clamp device pixel ratio
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
      
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 text-xs bg-black/50 text-white p-2 rounded">
          WebGL: ✓ | Particles: Dynamic
        </div>
      )}
    </div>
  )
}
