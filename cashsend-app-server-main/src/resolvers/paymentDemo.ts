import { ObjectId } from 'mongodb'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { PartnerModel as Partner } from '../model/Partner'
import { MyContext } from '../types'
import { PaymentRedirectLinks } from '../types/graphql/InputTypes/PaymentRedirectLinks'
import { CreateCheckoutResponse } from '../types/graphql/ObjectTypes/PaymentResponse'
import { calculateTransferAmount } from '../utils/helper/calculateTransferAmount'
import { getStripeInTestMode } from '../utils/stripe/createStripeCLient'

const stripe = getStripeInTestMode()

@Resolver()
export class PaymentDemoResolver {
  @Query(() => String)
  pay_stripePublicTestKey(): String {
    return process.env.STRIPE_PUBLIC_KEY_TEST!
  }

  @Mutation(() => CreateCheckoutResponse)
  async pay_createDemoCheckout(
    @Arg('amount') amount: number,
    @Arg('email') email: string,
    @Arg('partnerID') partnerID: ObjectId,
    @Arg('redirect', () => PaymentRedirectLinks, { nullable: true })
    @Ctx()
    { req }: MyContext
  ): Promise<CreateCheckoutResponse> {
    const partner = await Partner.findOne({ _id: partnerID })
    const cent = amount * 100

    if (!partner || !partner.connectID) {
      throw new Error()
    }

    let return_url = req.headers.origin
      ? req.headers.origin
      : process.env.CORS_CHECKOUT_DEMO

    const success_url = `${return_url}/stripe-checkout/status/success?receiver=${encodeURIComponent(
      partner.name
    )}&amount=${amount * 100}`

    const cancel_url = `${return_url}/stripe-checkout/status/cancel?receiver=${encodeURIComponent(
      partner.name
    )}&amount=${amount * 100}`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'eps', 'sepa_debit'],
      mode: 'payment',
      billing_address_collection: 'auto',
      customer_email: email,
      line_items: [
        {
          name: 'Zahlbetrag',
          amount: cent,
          currency: 'EUR',
          quantity: 1
        }
      ],
      payment_intent_data: {
        application_fee_amount: cent - calculateTransferAmount(cent),
        on_behalf_of: partner.connectID,
        transfer_data: {
          destination: partner.connectID
        }
      },
      success_url,
      cancel_url
    })

    return {
      checkoutSessionID: session.id
    }
  }
}
