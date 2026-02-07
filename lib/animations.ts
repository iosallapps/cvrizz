import { Variants, Transition } from "framer-motion"

// ============================================
// TRANSITION PRESETS
// ============================================

export const easeOut: Transition = {
  duration: 0.2,
  ease: [0.25, 0.1, 0.25, 1],
}

export const easeInOut: Transition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1],
}

export const spring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
}

// ============================================
// ANIMATION VARIANTS
// ============================================

/**
 * Simple fade in/out animation
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

/**
 * Slide up from below with fade
 */
export const slideUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
}

/**
 * Slide down from above with fade
 */
export const slideDown: Variants = {
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

/**
 * Scale in from slightly smaller
 */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
}

/**
 * Slide in from left
 */
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
}

/**
 * Slide in from right
 */
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
}

// ============================================
// STAGGER ANIMATIONS
// ============================================

/**
 * Parent container for staggered children
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
}

/**
 * Child item for staggered animations
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15 },
  },
  exit: {
    opacity: 0,
    y: 4,
    transition: { duration: 0.1 },
  },
}

/**
 * Faster stagger for shorter lists
 */
export const staggerFast: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.03,
    },
  },
}

// ============================================
// INTERACTION ANIMATIONS
// ============================================

/**
 * Subtle tap animation for buttons
 */
export const tapAnimation = {
  whileTap: { scale: 0.98 },
  transition: { duration: 0.1 },
}

/**
 * Subtle hover lift for cards
 */
export const hoverLift = {
  whileHover: { y: -2 },
  transition: { duration: 0.2 },
}

/**
 * Scale on hover for interactive elements
 */
export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.15 },
}

// ============================================
// PAGE TRANSITIONS
// ============================================

/**
 * Default page transition
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.2,
    },
  },
}

// ============================================
// MODAL/OVERLAY ANIMATIONS
// ============================================

/**
 * Backdrop fade animation
 */
export const backdropFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
}

/**
 * Modal pop animation
 */
export const modalPop: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 5,
    transition: {
      duration: 0.15,
    },
  },
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Creates a delay variant for staggered animations
 */
export function withDelay(variants: Variants, delay: number): Variants {
  return {
    ...variants,
    animate: {
      ...variants.animate,
      transition: {
        ...(typeof variants.animate === "object" ? variants.animate.transition : {}),
        delay,
      },
    },
  }
}

/**
 * Combines multiple variant objects
 */
export function combineVariants(...variants: Variants[]): Variants {
  return variants.reduce((acc, variant) => {
    return {
      initial: { ...acc.initial, ...variant.initial },
      animate: { ...acc.animate, ...variant.animate },
      exit: { ...acc.exit, ...variant.exit },
    }
  }, {} as Variants)
}
