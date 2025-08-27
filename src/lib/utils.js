import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and merges them with tailwind-merge.
 * @param {...any} inputs - Class names or expressions to combine.
 * @returns {string} The merged class name string.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
