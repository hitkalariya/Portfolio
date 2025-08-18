import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/*
🚀 SETUP GUIDE - Custom Cursor

Creates an interactive cursor with glow effect.

Customization:
1. Size: Modify width/height in motion.div
2. Colors: Change background colors and glows
3. Animation: Adjust transition spring settings
4. Blend Mode: Change mix-blend-mode for different effects

Disable: Set VITE_ENABLE_CURSOR_EFFECTS=false in .env

Performance: Uses transform3d for GPU acceleration
*/

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const enableCursorEffects = import.meta.env.VITE_ENABLE_CURSOR_EFFECTS !== 'false';
    if (!enableCursorEffects) {
      console.log('Cursor effects disabled via env variable');
      return;
    }
    
    console.log('Cursor effects enabled, setting up listeners');

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add event listeners
    window.addEventListener('mousemove', updateMousePosition);
    
    // Add hover detection to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  const enableCursorEffects = import.meta.env.VITE_ENABLE_CURSOR_EFFECTS !== 'false';
  if (!enableCursorEffects) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] shadow-lg border-2 border-primary"
        style={{
          boxShadow: '0 0 20px hsl(var(--primary))',
        }}
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 1.5 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 1000,
          damping: 28,
          mass: 0.1
        }}
      />
      
      {/* Cursor outline ring */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 border-2 border-primary/50 rounded-full pointer-events-none z-[9998]"
        style={{
          boxShadow: '0 0 30px hsl(var(--primary) / 0.3)',
        }}
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
          scale: isHovering ? 1.5 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1
        }}
      />
      
      {/* Glowing trail effect */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 bg-primary/20 rounded-full pointer-events-none z-[9997] blur-sm"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
          scale: isHovering ? 2 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 25,
          mass: 0.2
        }}
      />
    </>
  );
};