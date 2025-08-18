import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

/*
🚀 SETUP GUIDE - Background Sphere

This creates an animated background sphere with wireframe effect.

Customization Options:
1. Size: Change args={[radius, widthSegments, heightSegments]}
2. Material: Modify wireframe, color, opacity
3. Animation: Adjust rotation speed in useFrame
4. Position: Change position={[x, y, z]}

Performance Tips:
- Reduce segments for better performance (default: 64, 32)
- Lower opacity for subtle effect
- Disable wireframe for filled sphere
*/

interface BackgroundSphereProps {
  mousePosition: { x: number; y: number };
}

export const BackgroundSphere = ({ mousePosition }: BackgroundSphereProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (sphereRef.current) {
      // Gentle rotation based on time
      sphereRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      
      // Subtle mouse interaction - sphere tilts toward cursor
      const targetRotationX = mousePosition.y * 0.1;
      const targetRotationY = mousePosition.x * 0.1;
      
      sphereRef.current.rotation.x += (targetRotationX - sphereRef.current.rotation.x) * 0.05;
      sphereRef.current.rotation.y += (targetRotationY - sphereRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <Sphere
      ref={sphereRef}
      args={[8, 64, 32]}
      position={[0, 0, -10]}
    >
      <meshStandardMaterial
        color="#8b5cf6"
        wireframe
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
      />
    </Sphere>
  );
};