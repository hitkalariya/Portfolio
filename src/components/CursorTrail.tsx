
// === src/components/CursorTrail.tsx ===
'use client'

import { useEffect, useState, useRef } from 'react'

interface TrailPoint {
  x: number
  y: number
  opacity: number
}

export function CursorTrail() {
  const [trail, setTrail] = useState<TrailPoint[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const animationRef = useRef<number>()

  useEffect(() => {
    // ACCESSIBILITY: Check if cursor effects are enabled and motion is allowed
    const enableEffects = process.env.NEXT_PUBLIC_ENABLE_CURSOR_EFFECTS === 'true'
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!enableEffects || reducedMotion) return

    let mouseX = 0
    let mouseY = 0

    const updateMouse = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      setIsVisible(true)
    }

    const hideCursor = () => {
      setIsVisible(false)
    }

    const updateTrail = () => {
      setTrail(prevTrail => {
        const newTrail = [...prevTrail]
        
        // Add new point
        newTrail.unshift({ x: mouseX, y: mouseY, opacity: 1 })
        
        // Update opacity and remove old points
        for (let i = 0; i < newTrail.length; i++) {
          newTrail[i].opacity = Math.max(0, 1 - (i / 20))
        }
        
        // Keep only the most recent points
        return newTrail.slice(0, 20)
      })

      animationRef.current = requestAnimationFrame(updateTrail)
    }

    document.addEventListener('mousemove', updateMouse)
    document.addEventListener('mouseleave', hideCursor)
    document.addEventListener('mouseenter', updateMouse)

    updateTrail()

    return () => {
      document.removeEventListener('mousemove', updateMouse)
      document.removeEventListener('mouseleave', hideCursor)
      document.removeEventListener('mouseenter', updateMouse)
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trail.map((point, index) => (
        <div
          key={index}
          className="absolute w-2 h-2 rounded-full bg-primary/40 transform -translate-x-1 -translate-y-1"
          style={{
            left: point.x,
            top: point.y,
            opacity: point.opacity,
            transform: `translate(-50%, -50%) scale(${1 - index * 0.05})`,
          }}
        />
      ))}
    </div>
  )
}
