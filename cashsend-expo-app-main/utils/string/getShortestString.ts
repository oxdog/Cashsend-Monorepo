export const getShortestString = (...args: string[]) =>
  args.reduce((a, b) => (a.length < b.length ? a : b))
