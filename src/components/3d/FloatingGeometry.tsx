import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Octahedron, Torus } from '@react-three/drei';
import * as THREE from 'three';

/*
🚀 SETUP GUIDE - Floating Geometry

Creates floating 3D geometric shapes with mouse interaction.

Customization:
1. Shapes: Add/remove geometric primitives
2. Colors: Change material color props
3. Size: Modify args prop for each shape
4. Animation: Adjust rotation speeds and floating ranges
5. Mouse Interaction: Change sensitivity multipliers

Available Shapes:
- Box, Sphere, Cylinder, Cone, Octahedron, Torus, etc.
- Import from @react-three/drei

Adding New Shapes:
1. Import shape from @react-three/drei
2. Add to JSX with position and material
3. Add ref to useFrame for animation

Performance:
- Fewer shapes = better performance
- Lower geometry complexity (segments/detail)
- Consider LOD (Level of Detail) for distance-based optimization
*/

interface FloatingGeometryProps {
  mousePosition: { x: number; y: number };
}

export const FloatingGeometry = ({ mousePosition }: FloatingGeometryProps) => {
  const boxRef = useRef<THREE.Mesh>(null);
  const octahedronRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Animate box
    if (boxRef.current) {
      boxRef.current.rotation.x = time * 0.3;
      boxRef.current.rotation.y = time * 0.2;
      boxRef.current.position.y = Math.sin(time * 0.5) * 2;
      
      // Mouse interaction
      boxRef.current.position.x += (mousePosition.x * 2 - boxRef.current.position.x) * 0.02;
    }
    
    // Animate octahedron
    if (octahedronRef.current) {
      octahedronRef.current.rotation.x = time * -0.2;
      octahedronRef.current.rotation.z = time * 0.4;
      octahedronRef.current.position.y = Math.cos(time * 0.7) * 1.5;
      
      // Mouse interaction (opposite direction)
      octahedronRef.current.position.x += (-mousePosition.x * 1.5 - octahedronRef.current.position.x) * 0.02;
    }
    
    // Animate torus
    if (torusRef.current) {
      torusRef.current.rotation.y = time * 0.5;
      torusRef.current.rotation.z = time * 0.1;
      torusRef.current.position.x = Math.sin(time * 0.3) * 3;
      
      // Mouse interaction on Y axis
      torusRef.current.position.y += (mousePosition.y * 2 - torusRef.current.position.y) * 0.03;
    }
  });

  return (
    <group>
      {/* Floating Box */}
      <Box
        ref={boxRef}
        args={[0.8, 0.8, 0.8]}
        position={[-4, 2, 0]}
      >
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.7}
          wireframe
        />
      </Box>

      {/* Floating Octahedron */}
      <Octahedron
        ref={octahedronRef}
        args={[1]}
        position={[4, -1, 2]}
      >
        <meshStandardMaterial
          color="#06b6d4"
          transparent
          opacity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </Octahedron>

      {/* Floating Torus */}
      <Torus
        ref={torusRef}
        args={[1.2, 0.4, 16, 32]}
        position={[0, -3, 1]}
      >
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.5}
          wireframe
        />
      </Torus>
    </group>
  );
};