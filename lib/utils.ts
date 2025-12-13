import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// 🔹 UI Utilities
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 🔹 Helpers
// Mock persistence for demo purposes
export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
