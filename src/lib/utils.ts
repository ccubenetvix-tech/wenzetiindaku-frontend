// Import clsx for conditional class name handling
import { clsx, type ClassValue } from "clsx"
// Import tailwind-merge for merging Tailwind CSS classes
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge and deduplicate CSS class names
 * 
 * This function combines clsx (for conditional classes) with tailwind-merge
 * (for Tailwind CSS class deduplication) to create a robust class name utility.
 * 
 * @param inputs - Variable number of class name inputs (strings, objects, arrays)
 * @returns Merged and deduplicated class name string
 * 
 * @example
 * cn('px-2 py-1', 'px-4') // Returns 'py-1 px-4' (px-2 is overridden by px-4)
 * cn('text-red-500', { 'text-blue-500': isActive }) // Conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
