/**
 * SETUP GUIDE (2 steps)
 * STEP 1: Install framer-motion package
 * STEP 2: Set NEXT_PUBLIC_REDUCED_MOTION="false" in .env.local
 * NOTE: Centralized motion configuration with accessibility support
 * TODO: Add more complex animation variants
 */

import { Variants } from 'framer-motion'

// BEGINNER: Set NEXT_PUBLIC_REDUCED_MOTION="false" in .env.local to enable animations

// Motion tokens for consistent animations
export const motionTokens = {
  easing: {
    ease: [0.25, 0.1, 0.25, 1],
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
  },
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
    slower: 0.75,
  },
}

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.normal,
      ease: motionTokens.easing.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.easing.easeIn,
    },
  },
}

// Card animation variants
export const cardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: motionTokens.duration.normal,
      ease: motionTokens.easing.easeOut,
    },
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      duration: motionTokens.duration.fast,
      ease: motionTokens.easing.easeOut,
    },
  },
}

// Stagger container for lists
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Fade in up animation
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: motionTokens.duration.normal,
      ease: motionTokens.easing.easeOut,
    },
  },
}

// Scale in animation
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: motionTokens.duration.normal,
      ease: motionTokens.easing.easeOut,
    },
  },
}

// Slide in from left
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -50,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: motionTokens.duration.normal,
      ease: motionTokens.easing.easeOut,
    },
  },
}

// Check if reduced motion is preferred
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Get motion config based on user preference
export function getMotionConfig() {
  const reducedMotion = prefersReducedMotion() || 
    process.env.NEXT_PUBLIC_REDUCED_MOTION === 'true'
  
  return {
    reducedMotion,
    // ACCESSIBILITY: Disable animations if user prefers reduced motion
    transition: reducedMotion ? { duration: 0 } : undefined,
  }
}