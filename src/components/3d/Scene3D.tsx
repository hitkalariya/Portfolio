import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { BackgroundSphere } from './BackgroundSphere';
import { ParticleField } from './ParticleField';
import { FloatingGeometry } from './FloatingGeometry';

/*
🚀 SETUP GUIDE - 3D Scene Configuration

This is the main 3D scene container. To customize:

1. Performance Settings:
   - Reduce particleCount in ParticleField (default: 100)
   - Lower geometry complexity in FloatingGeometry
   - Disable shadow casting for better performance

2. Visual Customization:
   - Change colors in each component's material props
   - Adjust lighting intensity in individual components
   - Modify rotation speeds and animation timing

3. Environment Variables (in .env):
   - VITE_ENABLE_3D=true/false (toggles entire 3D scene)
   - VITE_ENABLE_PARTICLES=true/false (toggles particles only)
   - VITE_HIGH_PERFORMANCE=true/false (reduces quality for performance)

4. Browser Compatibility:
   - WebGL fallback is handled automatically
   - Graceful degradation to static background if WebGL unavailable
   - Mobile optimization through performance detection
*/

interface Scene3DProps {
  mousePosition: { x: number; y: number };
  enabled?: boolean;
}

export const Scene3D = ({ mousePosition, enabled = true }: Scene3DProps) => {
  // Environment variable checks
  const enable3D = import.meta.env.VITE_ENABLE_3D !== 'false';
  const enableParticles = import.meta.env.VITE_ENABLE_PARTICLES !== 'false';
  const highPerformance = import.meta.env.VITE_HIGH_PERFORMANCE === 'true';

  // Check for WebGL support
  const supportsWebGL = (() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  })();

  if (!enabled || !enable3D || !supportsWebGL) {
    return (
      <div className="absolute inset-0 bg-gradient-hero opacity-50" />
    );
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 75,
          near: 0.1,
          far: 1000 
        }}
        dpr={highPerformance ? [1, 1.5] : [1, 2]}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: !highPerformance,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false
        }}
        onCreated={({ gl }) => {
          // Handle context loss
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            console.log('WebGL context lost, preventing default');
            e.preventDefault();
          });
          
          gl.domElement.addEventListener('webglcontextrestored', () => {
            console.log('WebGL context restored');
          });
        }}
      >
        <Suspense fallback={null}>
          {/* Ambient lighting for overall scene illumination */}
          <ambientLight intensity={0.4} />
          
          {/* Main directional light - reduced intensity */}
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={0.3} 
            color="#8b5cf6"
          />
          
          {/* Point light that follows mouse cursor - reduced intensity and distance */}
          <pointLight 
            position={[mousePosition.x * 5, mousePosition.y * 5, 3]} 
            intensity={0.4}
            color="#06b6d4"
            distance={15}
          />

          {/* Background animated sphere */}
          <BackgroundSphere mousePosition={mousePosition} />
          
          {/* Particle field effect - reduced count for performance */}
          {enableParticles && (
            <ParticleField 
              count={highPerformance ? 30 : 60}
              mousePosition={mousePosition}
            />
          )}
          
          {/* Floating geometric shapes - simplified */}
          <FloatingGeometry mousePosition={mousePosition} />
        </Suspense>
      </Canvas>
    </div>
  );
};