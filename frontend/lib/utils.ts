import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert a user-entered amount to microSTX.
 *  unit "STX"  → multiply by 1,000,000
 *  unit "μSTX" → pass through as-is (already microSTX)
 */
export function toMicroSTX(value: string, unit: "STX" | "μSTX"): number {
  const n = parseFloat(value);
  if (!n || n <= 0) return 0;
  return unit === "STX" ? Math.floor(n * 1_000_000) : Math.floor(n);
}

/** Format a microSTX amount for display */
export function formatSTX(microSTX: number, unit: "STX" | "μSTX"): string {
  if (unit === "STX") return `${(microSTX / 1_000_000).toLocaleString()} STX`;
  return `${microSTX.toLocaleString()} μSTX`;
}
