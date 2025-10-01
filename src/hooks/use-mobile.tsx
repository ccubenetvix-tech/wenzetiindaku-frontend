/**
 * Mobile Detection Hook
 * 
 * Custom hook to detect if the current viewport is mobile-sized.
 * Uses media queries and window resize events for responsive behavior.
 * 
 * @author WENZE TII NDAKU Team
 * @version 1.0.0
 */

import * as React from "react"

// Mobile breakpoint in pixels (matches Tailwind's md breakpoint)
const MOBILE_BREAKPOINT = 768

/**
 * Custom hook to detect mobile viewport
 * 
 * @returns boolean - true if viewport is mobile-sized, false otherwise
 */
export function useIsMobile() {
  // State to track mobile status, undefined initially for SSR compatibility
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Create media query listener for mobile breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Handler function to update mobile state
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Add event listener for media query changes
    mql.addEventListener("change", onChange)
    
    // Set initial state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Cleanup: remove event listener
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return boolean value (convert undefined to false)
  return !!isMobile
}
