/**
 * Utility functions for class name management
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names and removes conflicts
 * @param inputs - Array of class values to be merged
 * @returns Merged and de-duplicated class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
