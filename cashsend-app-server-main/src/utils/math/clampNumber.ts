export const clampNumber = (number: number, min: number, max: number) =>
  Math.max(min, Math.min(number, max))
