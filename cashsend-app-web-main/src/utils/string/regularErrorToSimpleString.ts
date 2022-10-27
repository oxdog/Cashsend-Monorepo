import { RegularErrorFragment } from '@generated/graphql'

export const regularErrorToSimpleString = (errors: RegularErrorFragment[]) =>
  errors.map((e) => `${e.field}: ${e.message}`).join('\n\n')
