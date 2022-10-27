import Stripe from 'stripe'
import { PaymentMethodOptions } from '../../types/graphql/Enum/PaymentMethodOptions'
import { PaymentMethod } from '../../types/graphql/ObjectTypes/PaymentMethod'

export const convertPaymentMethodsToLast4AndType = (
  methods: Stripe.Response<Stripe.ApiList<Stripe.PaymentMethod>>,
  type: PaymentMethodOptions
) =>
  methods.data.map((pm) => {
    if (!pm[type]?.last4) throw new Error(`Type ${type} has no last digits`)

    return { type, last4: pm[type]?.last4, owner: pm.billing_details?.name }
  }) as PaymentMethod[]
