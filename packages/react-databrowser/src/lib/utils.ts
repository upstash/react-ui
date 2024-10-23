import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumberWithCommas(value: number) {
  return value.toString().replaceAll(/\B(?=(\d{3})+(?!\d))/g, ",")
}

export function formatNumber(value: number) {
  const intl = new Intl.NumberFormat("en-US")

  return intl.format(value)
}

const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  min: 60 * 1000,
  second: 1000,
} as const

// 130 -> 2 minutes
// 7800 -> 2 hours
/** 130 is "2 minutes", 5 is "5 seconds" */
export function formatTime(seconds: number) {
  for (const [unit, value] of Object.entries(units)) {
    const interval = (seconds * 1000) / value
    if (interval >= 1) {
      return `${Math.floor(interval)} ${unit}${interval > 1 && unit !== "min" ? "s" : ""}`
    }
  }
  return "just now"
}
