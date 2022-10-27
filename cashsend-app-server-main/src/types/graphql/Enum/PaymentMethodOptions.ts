import { registerEnumType } from 'type-graphql'

export enum PaymentMethodOptions {
  // APPLE_PAY = 'apple_pay',
  // GOOGLE_PAY = 'google_pay',
  CARD = 'card',
  SEPA = 'sepa_debit'
}

registerEnumType(PaymentMethodOptions, {
  name: 'PaymentMethodOptions',
  description: 'The PaymentMethod Types a Customer can save to his account'
})
