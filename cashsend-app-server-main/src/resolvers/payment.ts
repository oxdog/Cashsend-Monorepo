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
import { isStripeCustomer } from '../middleware/isStripeCustomer'
import { OrderModel as Order } from '../model/Order'
import { PartnerModel as Partner } from '../model/Partner'
import { UserModel as User } from '../model/User'
import { MyContext } from '../types'
import { OrderType } from '../types/Enum/OrderType'
import { PaymentMethodOptions } from '../types/graphql/Enum/PaymentMethodOptions'
import { PaymentRedirectLinks } from '../types/graphql/InputTypes/PaymentRedirectLinks'
import {
  CreateCheckoutResponse,
  CreateCheckoutSetupResponse,
  CreateSetupIntentResponse,
  OffSessionPaymentResponse
} from '../types/graphql/ObjectTypes/PaymentResponse'
import { PaymentSheetResponse } from '../types/graphql/ObjectTypes/PaymentSheetResponse'
import { RetrievetPaymentMethodResponse } from '../types/graphql/ObjectTypes/RetrievetPaymentMethodResponse'
import { calculateTransferAmount } from '../utils/helper/calculateTransferAmount'
import { convertPaymentMethodsToLast4AndType } from '../utils/stripe/convertPaymentMethodsToLast4AndType'
import stripe from '../utils/stripe/createStripeCLient'
import { retrieveCustomerPaymentMethods } from '../utils/stripe/retrieveCustomerPaymentMethods'

@Resolver()
export class PaymentResolver {
  @Query(() => String)
  pay_stripePublicKey(): String {
    return __prod__
      ? process.env.STRIPE_PUBLIC_KEY!
      : process.env.STRIPE_PUBLIC_KEY_TEST!
  }

  @UseMiddleware(isAuth)
  @UseMiddleware(isStripeCustomer)
  @Query(() => Boolean)
  async pay_validateDefaultPaymentMethod(
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    try {
      const user = req.user!
      const customer = user.stripeID!
      const type =
        user.defaultPaymentMethod as Stripe.PaymentMethodListParams.Type

      if (type) {
        throw new Error('No default payment method selected or setup')
      }

      const paymentMethods = await stripe.paymentMethods.list({
        customer,
        type
      })

      return paymentMethods.data.length > 0
    } catch (e) {
      // console.error('error', e)
      return false
    }
  }

  @UseMiddleware(isAuth)
  @UseMiddleware(isStripeCustomer)
  @Query(() => RetrievetPaymentMethodResponse)
  async pay_getDefaultPaymentMethod(
    @Ctx() { req }: MyContext
  ): Promise<RetrievetPaymentMethodResponse> {
    const user = req.user!
    const customer = user.stripeID!
    const isProcessing = user!.isDefaultPaymentMethodProcessing

    if (isProcessing) {
      console.log('processing return')
      return { isProcessing }
    }

    if (!user.defaultPaymentMethod) {
      console.log('no pm setup')
      return {
        paymentMethod: undefined
      }
    }

    const methods = await retrieveCustomerPaymentMethods(
      customer,
      user.defaultPaymentMethod
    )

    const convertedMethod = convertPaymentMethodsToLast4AndType(
      methods,
      user.defaultPaymentMethod
    )[0]

    console.log('convertedMethod', convertedMethod)

    return { paymentMethod: convertedMethod }
  }

  @UseMiddleware(isAuth)
  @UseMiddleware(isStripeCustomer)
  @Query(() => RetrievetPaymentMethodResponse)
  async pay_retrievetPaymentMethod(
    @Arg('paymentMethodId') paymentMethodId: string,
    @Ctx() { req }: MyContext
  ): Promise<RetrievetPaymentMethodResponse> {
    const isProcessing = req.user!.isDefaultPaymentMethodProcessing

    if (isProcessing) {
      return { isProcessing }
    }

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

    if (!paymentMethod) {
      throw new UserInputError(
        'No payment method found for provided paymentMethodId'
      )
    }

    const type = paymentMethod.type as PaymentMethodOptions

    return {
      paymentMethod: {
        type,
        last4: (paymentMethod[type]?.last4 as string) || 'xxxx'
      }
    }
  }

  @UseMiddleware(isAuth)
  @UseMiddleware(isStripeCustomer)
  @Mutation(() => Boolean)
  async pay_removePaymentMethodOfType(
    @Arg('type', () => PaymentMethodOptions, { nullable: true })
    type: PaymentMethodOptions,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    try {
      const user = req.user!
      const customer = user.stripeID!

      const removeMethods = async (type: PaymentMethodOptions) => {
        const paymentMethods = await stripe.paymentMethods.list({
          customer,
          type
        })

        paymentMethods.data.forEach(
          async (pm) => await stripe.paymentMethods.detach(pm.id)
        )
      }

      if (!type) {
        await removeMethods(PaymentMethodOptions.CARD)
        await removeMethods(PaymentMethodOptions.SEPA)

        user.defaultPaymentMethod = undefined
        await user.save()
      } else {
        await removeMethods(type)

        if (type === user.defaultPaymentMethod) {
          user.defaultPaymentMethod = undefined
          await user.save()
        }
      }

      return true
    } catch (e) {
      console.error('error', e)
      throw new Error('Something failed when deleting PaymentMethods of type ')
    }
  }

  @UseMiddleware(isAuth)
  @UseMiddleware(isStripeCustomer)
  @Mutation(() => Boolean)
  async pay_changeDefaultPaymentMethod(
    @Arg('type', () => PaymentMethodOptions) type: PaymentMethodOptions,
    @Ctx() { req }: MyContext
  ): Promise<boolean> {
    try {
      const user = req.user!
      const customer = user.stripeID!

      await stripe.paymentMethods.list({
        customer,
        type
      })

      user.defaultPaymentMethod = type
      await user.save()

      return true
    } catch (e) {
      console.error('error', e)
      throw new Error('Something failed when updating default PaymentMethod ')
    }
  }

  @UseMiddleware(isAuth)
  @UseMiddleware(isStripeCustomer)
  @Mutation(() => CreateSetupIntentResponse)
  async pay_createSetupIntent(
    @Ctx() { req }: MyContext
  ): Promise<CreateSetupIntentResponse> {
    try {
      const customer = req.user!.stripeID!

      const { client_secret } = await stripe.setupIntents.create({
        customer,
        payment_method_types: ['sepa_debit', 'card']
      })

      if (!client_secret) throw new Error('No client_secret created')

      await User.updateOne(
        { stripeID: customer },
        { isDefaultPaymentMethodProcessing: true }
      )

      return {
        clientSecret: client_secret
      }
    } catch (e) {
      console.error('pay_createSetupIntent error', e)
      return {
        error: 'Failed to create client_secret'
      }
    }
  }

  @UseMiddleware(isAuth)
  @UseMiddleware(isStripeCustomer)
  @Mutation(() => Boolean)
  async pay_cancelSetupIntent(@Ctx() { req }: MyContext): Promise<boolean> {
    try {
      const customer = req.user!.stripeID!

      await User.updateOne(
        { stripeID: customer },
        { isDefaultPaymentMethodProcessing: false }
      )

      return true
    } catch (e) {
      console.error('pay_cancelSetupIntent error', e)
      return false
    }
  }

  @UseMiddleware(isAuth)
  @UseMiddleware(isStripeCustomer)
  @Mutation(() => OffSessionPaymentResponse)
  async pay_offSessionPayment(
    @Arg('amount') amount: number,
    @Arg('partnerID') partnerID: ObjectId,
    @Ctx() { req }: MyContext
  ): Promise<OffSessionPaymentResponse | void> {
    let orderID: ObjectId | undefined
    const user = req.user!

    if (amount < 100 || amount > 20000) {
      throw new UserInputError('Incorrect amount')
    }

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

  //#region

  @UseMiddleware(isAuth)
  @UseMiddleware(isStripeCustomer)
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
  @UseMiddleware(isStripeCustomer)
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
    const cent = amount * 100

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
        application_fee_amount: cent - calculateTransferAmount(cent),
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

  @Mutation(() => CreateCheckoutResponse)
  async pay_createCheckoutNonCustomer(
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
      : process.env.CORS_WEB_ENDPOINT

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

  @UseMiddleware(isAuth)
  @UseMiddleware(isStripeCustomer)
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
      payment_method_types: ['card'],
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

  // @UseMiddleware(isAuth)
  // @UseMiddleware(isStripeCustomer)
  // @Query(() => [PaymentMethod])
  // async pay_getMyPaymentMethods(
  //   @Arg('type', () => PaymentMethodOptions, { nullable: true })
  //   type: PaymentMethodOptions,
  //   @Ctx() { req }: MyContext
  // ): Promise<PaymentMethod[]> {
  //   const user = req.user!
  //   const customer = user.stripeID!

  //   const paymentMethods: PaymentMethod[] = []

  //   if (type) {
  //     const methods = await retrieveCustomerPaymentMethods(customer, type)
  //     paymentMethods.push(...convertPaymentMethodsToLast4AndType(methods, type))
  //   } else {
  //     const cardMethods = await retrieveCustomerPaymentMethods(
  //       customer,
  //       PaymentMethodOptions.CARD
  //     )

  //     paymentMethods.push(
  //       ...convertPaymentMethodsToLast4AndType(
  //         cardMethods,
  //         PaymentMethodOptions.CARD
  //       )
  //     )

  //     const sepaMethods = await retrieveCustomerPaymentMethods(
  //       customer,
  //       PaymentMethodOptions.SEPA
  //     )

  //     paymentMethods.push(
  //       ...convertPaymentMethodsToLast4AndType(
  //         sepaMethods,
  //         PaymentMethodOptions.SEPA
  //       )
  //     )
  //   }

  //   return paymentMethods
  // }

  // @Query(() => String)
  // async pay_offSessionTest(): Promise<string | void> {
  //   try {
  //     const intent = await stripe.paymentIntents.create({
  //       amount: 999,
  //       currency: 'EUR',
  //       payment_method_types: ['card', 'sepa_debit', 'sofort'],
  //       customer: 'cus_JU2ahxjVV7U2Fr',
  //       // payment_method: 'pm_1Ir4YGBTTIgALKYD9WDRu9rs', // ✔️ Card
  //       // payment_method: 'pm_1JC5m8BTTIgALKYDTF86VVqb', // ✔️ Sepa **** 3000
  //       // payment_method: 'pm_1JC5lIBTTIgALKYDFQ4W9Z2A', // ✔️ Sepa **** 3204
  //       // payment_method: 'pm_card_authenticationRequiredOnSetup', // ❌ fails off-session, will be ok if card is setup in advance
  //       // payment_method: 'pm_card_authenticationRequired', // ❌ fails off-session
  //       payment_method:
  //         'pm_card_authenticationRequiredChargeDeclinedInsufficientFunds' // ❌
  //       // payment_method: 'pm_card_authenticationRequiredSetupForOffSession', // ✔️
  //       // off_session: true,
  //       // confirm: true
  //     })

  //     console.log('intent', intent)

  //     return 'ok'
  //   } catch (e) {
  //     console.error('error', e)
  //   }
  // }

  //#endregion
}
