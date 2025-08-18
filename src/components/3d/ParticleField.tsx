import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

/*
🚀 SETUP GUIDE - Particle Field

Creates floating particles that react to mouse movement.

Customization:
1. Particle Count: Adjust count prop (default: 100)
   - Low performance: 50 particles
   - High performance: 200+ particles

2. Colors: Modify colors array for different particle colors

3. Movement:
   - Speed: Change multiplication factors in useFrame
   - Range: Adjust spread in useMemo (default: 20)
   - Mouse sensitivity: Modify mousePosition multipliers

4. Size: Change size prop in PointMaterial

Performance Notes:
- More particles = lower FPS
- Reduce count on mobile devices
- Consider disabling on low-end devices
*/

interface ParticleFieldProps {
  count?: number;
  mousePosition: { x: number; y: number };
}

export const ParticleField = ({ count = 100, mousePosition }: ParticleFieldProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate random particle positions
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y  
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }
    
    return positions;
  }, [count]);

  // Generate random colors for particles
  const colors = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const colorPalette = [
      new THREE.Color('#8b5cf6'), // Primary purple
      new THREE.Color('#06b6d4'), // Secondary cyan
      new THREE.Color('#10b981'), // Accent green
    ];
    
    for (let i = 0; i < count; i++) {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return colors;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      // Gentle floating animation
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
      
      // React to mouse movement
      const targetRotationX = mousePosition.y * 0.2;
      const targetRotationY = mousePosition.x * 0.2;
      
      pointsRef.current.rotation.x += (targetRotationX - pointsRef.current.rotation.x) * 0.02;
      pointsRef.current.rotation.y += (targetRotationY - pointsRef.current.rotation.y) * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        transparent
        vertexColors
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </points>
  );
};