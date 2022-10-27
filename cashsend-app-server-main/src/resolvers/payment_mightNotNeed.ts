// ********************************
// * Just for backup to copy paste stuff around
// ********************************

import { ForbiddenError, UserInputError } from 'apollo-server-express'
import { ObjectId } from 'mongodb'
import Stripe from 'stripe'
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql'
import { __prod__ } from '../constants'
import { isAuth } from '../middleware/isAuth'
import { OrderModel as Order } from '../model/Order'
import { PartnerModel as Partner } from '../model/Partner'
import { MyContext } from '../types'
import { OrderType } from '../types/Enum/OrderType'
import { PaymentRedirectLinks } from '../types/graphql/InputTypes/PaymentRedirectLinks'
import {
  CreateCheckoutResponse,
  CreateCheckoutSetupResponse,
  CreateSetupIntentResponse,
  OffSessionPaymentResponse
} from '../types/graphql/ObjectTypes/PaymentResponse'
import { PaymentSheetResponse } from '../types/graphql/ObjectTypes/PaymentSheetResponse'
import stripe from '../utils/stripe/createStripeCLient'

@Resolver()
export class PaymentResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => CreateCheckoutResponse)
  async pay_createCheckout(
    @Arg('amount') amount: number,
    @Arg('partnerID') partnerID: ObjectId,
    @Arg('redirect', () => PaymentRedirectLinks, { nullable: true })
    redirect: PaymentRedirectLinks,
    @Ctx() { req }: MyContext
  ): Promise<CreateCheckoutResponse> {
    const user = req.user!
    const partner = await Partner.findOne({ _id: partnerID })

    if (!partner || !partner.connectID) {
      throw new Error()
    }

    let return_url = req.headers.origin
      ? req.headers.origin
      : process.env.CORS_WEB_ENDPOINT

    redirect.successLink = redirect.successLink.concat(
      `&receiver=${partner.name}`
    )

    const success_url = `${return_url}/stripe-checkout/status/success${
      redirect && `?redirect=${encodeURIComponent(redirect.successLink)}`
    }`

    const cancel_url = `${return_url}/stripe-checkout/status/cancel${
      redirect && `?redirect=${encodeURIComponent(redirect.cancelLink)}`
    }`

    if (!user.stripeID) {
      const customer = await stripe.customers.create({
        name: user.firstName,
        email: user.email
      })

      user.stripeID = customer.id

      await user.save()
    }

    // * Payment
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeID,
      payment_method_types: ['card', 'giropay', 'eps', 'sepa_debit', 'sofort'],
      mode: 'payment',
      billing_address_collection: 'auto',
      line_items: [
        {
          name: 'Zahlbetrag',
          amount,
          currency: 'EUR',
          quantity: 1
        }
      ],
      payment_intent_data: {
        application_fee_amount: amount * 0.01,
        on_behalf_of: partner.connectID,
        transfer_data: {
          destination: partner.connectID
        }
      },
      success_url,
      cancel_url
    })

    // console.log('checkoutSessionID', session.id)
    // console.log('customer', user)
    // console.log('session', session)

    return {
      checkoutSessionID: session.id
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => CreateCheckoutSetupResponse)
  async pay_createCheckoutSetup(
    @Ctx() { req }: MyContext
  ): Promise<CreateCheckoutSetupResponse> {
    const user = req.user!

    if (!user.stripeID) {
      const customer = await stripe.customers.create({
        name: user.firstName,
        email: user.email
      })

      user.stripeID = customer.id
      await user.save()
    }

    let returnurl = req.headers.origin
      ? req.headers.origin
      : process.env.CORS_WEB_ENDPOINT

    // * Setup
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeID,
      payment_method_types: ['sepa_debit'],
      mode: 'setup',
      success_url: `${returnurl}/stripe-checkout-status?success=true`,
      cancel_url: `${returnurl}/stripe-checkout-status?errors=true`
    })

    // console.log('setupSessionID', session.id)
    // console.log('customer', user)
    // console.log('session', session)

    return {
      setupSessionID: session.id
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => CreateSetupIntentResponse)
  async pay_createSetupIntent(
    @Ctx() { req }: MyContext
  ): Promise<CreateSetupIntentResponse> {
    const user = req.user!
    const customer = user.stripeID!
    const type =
      user.defaultPaymentMethod as Stripe.PaymentMethodListParams.Type

    const paymentMethods = await stripe.paymentMethods.list({
      customer,
      type
    })

    const payment_method = paymentMethods.data[0].id

    if (!user.stripeID) {
      const customer = await stripe.customers.create({
        name: user.firstName,
        email: user.email
      })

      user.stripeID = customer.id
      await user.save()
    }

    const { client_secret } = await stripe.setupIntents.create({
      customer: user.stripeID,
      payment_method,
      payment_method_types: ['sepa_debit', 'card']
    })

    if (!client_secret) throw new Error('No client_secret created')

    return {
      clientSecret: client_secret
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => PaymentSheetResponse)
  async pay_createPaymentSheet(
    @Arg('amount') amount: number,
    @Arg('partnerID') partnerID: ObjectId,
    @Ctx() { req }: MyContext
  ): Promise<PaymentSheetResponse | void> {
    try {
      const user = req.user!
      const partner = await Partner.findOne({ _id: partnerID })

      console.log('partner', partner)

      if (!partner || !partner.connectID) {
        throw new Error()
      }

      if (!user.stripeID) {
        const customer = await stripe.customers.create({
          name: user.firstName,
          email: user.email
        })

        user.stripeID = customer.id

        await user.save()
      }

      const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: user.stripeID },
        { apiVersion: '2020-08-27' }
      )

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'EUR',
        application_fee_amount: 1,
        on_behalf_of: partner.connectID,
        transfer_data: {
          destination: partner.connectID
        },
        payment_method_options: {
          card: {
            request_three_d_secure: 'automatic'
          }
        },
        payment_method_types: ['sepa_debit'],
        // payment_method_types: ['card', 'sepa_debit', 'sofort'],
        customer: user.stripeID
      })

      return {
        paymentIntent: paymentIntent.client_secret!,
        ephemeralKey: ephemeralKey.secret!,
        customer: user.stripeID
      }
    } catch (e) {
      console.error('error', e)
    }
  }

  @UseMiddleware(isAuth)
  @Query(() => String)
  pay_stripePublicKey(): String {
    return __prod__
      ? process.env.STRIPE_PUBLIC_KEY!
      : process.env.STRIPE_PUBLIC_KEY_TEST!
  }

  @Query(() => String)
  async pay_offSessionTest(): Promise<string | void> {
    try {
      const intent = await stripe.paymentIntents.create({
        amount: 999,
        currency: 'EUR',
        payment_method_types: ['card', 'sepa_debit', 'sofort'],
        customer: 'cus_JU2ahxjVV7U2Fr',
        // payment_method: 'pm_1Ir4YGBTTIgALKYD9WDRu9rs', // ✔️ Card
        // payment_method: 'pm_1JC5m8BTTIgALKYDTF86VVqb', // ✔️ Sepa **** 3000
        // payment_method: 'pm_1JC5lIBTTIgALKYDFQ4W9Z2A', // ✔️ Sepa **** 3204
        // payment_method: 'pm_card_authenticationRequiredOnSetup', // ❌ fails off-session, will be ok if card is setup in advance
        // payment_method: 'pm_card_authenticationRequired', // ❌ fails off-session
        payment_method:
          'pm_card_authenticationRequiredChargeDeclinedInsufficientFunds' // ❌
        // payment_method: 'pm_card_authenticationRequiredSetupForOffSession', // ✔️
        // off_session: true,
        // confirm: true
      })

      console.log('intent', intent)

      return 'ok'
    } catch (e) {
      console.error('error', e)
    }
  }

  @UseMiddleware(isAuth)
  @Mutation(() => OffSessionPaymentResponse)
  async pay_offSessionPayment(
    @Arg('amount') amount: number,
    @Arg('partnerID') partnerID: ObjectId,
    @Ctx() { req }: MyContext
  ): Promise<OffSessionPaymentResponse | void> {
    let orderID: ObjectId | undefined
    const user = req.user!
    amount = Math.floor(amount * 100)

    try {
      const customer = user.stripeID
      const type =
        user.defaultPaymentMethod as Stripe.PaymentMethodListParams.Type

      const partner = await Partner.findOne({ _id: partnerID })

      if (!partner || !partner.connectID) {
        throw new UserInputError('Partner not found')
      }

      if (!customer || !type) {
        throw new ForbiddenError('Please add a payment method to continue')
      }

      if (!['card', 'sepa_debit', 'sofort'].includes(type)) {
        throw new ForbiddenError(
          `Payment method ${type} not suited for this kind of payment.`
        )
      }

      const paymentMethods = await stripe.paymentMethods.list({
        customer,
        type
      })

      if (!paymentMethods || paymentMethods.data.length === 0) {
        throw new ForbiddenError('No Payment Methods found')
      }

      // console.log('customer', customer)
      // console.log('defaultPaymentMethod', user.defaultPaymentMethod)
      // console.log('paymentMethods', paymentMethods)

      const payment_method = paymentMethods.data[0].id

      //Creat order and add it to user
      const order = await Order.create({
        user: user._id,
        partner: partnerID,
        amount,
        type: OrderType.SCAN_AND_PAY
      })

      if (!order) throw new Error('Order Creation failed')

      user.orders.push(order._id)
      await user.save()

      orderID = order._id as ObjectId

      console.log('order', order)

      await stripe.paymentIntents.create({
        amount,
        currency: 'EUR',
        customer,
        payment_method,
        payment_method_types: ['card', 'sepa_debit', 'sofort'],
        off_session: true,
        confirm: true,
        transfer_group: order.transferGroup,
        metadata: {
          orderID: orderID!.toString(),
          partnerID: partnerID.toString()
        }
      })

      return {
        orderID
      }
    } catch (err) {
      if (orderID) {
        await Order.deleteOne({ _id: orderID })

        user.orders = user.orders.filter((o) => o !== orderID)
        await user.save()
      }

      console.error('error', err)
      throw new Error('Something went wrong on the server ...' + err)
    }
  }
}
