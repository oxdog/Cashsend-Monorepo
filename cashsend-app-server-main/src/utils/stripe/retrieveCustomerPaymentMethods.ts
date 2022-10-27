import { PaymentMethodOptions } from '../../types/graphql/Enum/PaymentMethodOptions'
import stripe from './createStripeCLient'

export const retrieveCustomerPaymentMethods = async (
  customer: string,
  type: PaymentMethodOptions
) => {
  console.log('type', type)
  return await stripe.paymentMethods.list({
    customer,
    type
  })
}
