export const deepCloneOnlyValues = (object: any) => {
  return JSON.parse(JSON.stringify(object))
}
