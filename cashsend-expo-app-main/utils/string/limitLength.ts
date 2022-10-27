export const limitLength = (value: string, maxLength: number) =>
  value.length <= maxLength ? value : value.substr(0, 60).concat('...')
