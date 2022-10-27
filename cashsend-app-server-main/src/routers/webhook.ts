import { Expo, ExpoPushMessage } from 'expo-server-sdk'
import express, { Request, Response, Router } from 'express'
import Stripe from 'stripe'
import { OrderModel as Order } from '../model/Order'
import { PartnerModel as Partner } from '../model/Partner'
import { UserModel as User } from '../model/User'
import { OrderState } from '../types/Enum/OrderState'
import { PaymentMethodOptions } from '../types/graphql/Enum/PaymentMethodOptions'
import { calculateTransferAmount } from '../utils/helper/calculateTransferAmount'
import stripe from '../utils/stripe/createStripeCLient'

// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
const webhookRouter = Router()

let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN })

async function notifyUser(
  customerId: string,
  partnerName: string,
  amount: number
) {
  console.log('🔔 Notifying User')

  const user = await User.findOne({ stripeID: customerId })

  if (!user || !user.pushToken) {
    throw new Error('No User or pushToken on User')
  }

  const message = {
    to: user.pushToken,
    sound: 'default',
    body: `Die Zahlung von ${
      amount / 100
    }€ wurde erfolgreich an ${partnerName} gezahlt.`,
    data: { withSome: 'data' }
  }

  try {
    let ticket = (await expo.sendPushNotificationsAsync([
      message as ExpoPushMessage
    ])) as any

    const error = ticket.length > 0 ? ticket[0].details?.error : undefined

    if (error === 'DeviceNotRegistered') {
      user.pushToken = undefined
      await user.save()
    } else if (error) {
      throw new Error(error)
    }

    console.log('ticket', ticket)
  } catch (e) {
    console.error('error', e)
  }
}

async function handleSucceededPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    console.log(`☑️ PaymentIntent for ${paymentIntent.amount} was successful!`)
    console.log('💰👩‍🌾 Paying out Partner ')

    const { partnerID, orderID } = paymentIntent.metadata
    const transfer_group = paymentIntent.transfer_group
    const amount = paymentIntent.amount

    if (!transfer_group || !partnerID) {
      throw Error(
        'Payment failed to be transfered. No Transfer Group or PartnerID'
      )
    }

    const partner = await Partner.findOne({ _id: partnerID })
    const order = await Order.findOne({ _id: orderID })

    if (!partner || !partner.connectID) {
      throw new Error('Partner not found')
    }

    //TODO: Error handling

    await stripe.transfers.create({
      amount: calculateTransferAmount(amount),
      currency: 'eur',
      destination: partner.connectID,
      transfer_group
    })

    if (!order) {
      throw new Error(`Order ${orderID} does not exists`)
    }

    //TODO: error handling transfers
    notifyUser(
      paymentIntent.customer as string,
      partner.name,
      paymentIntent.amount
    )

    await order.setStateAndSave(OrderState.SUCCEEDED)
  } catch (e) {
    console.error('error in handleSucceededPayment', e)
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    const { orderID } = paymentIntent.metadata

    const order = await Order.findOne({ _id: orderID })

    if (!order) {
      throw new Error(`Order ${orderID} does not exists`)
    }

    await order.setStateAndSave(OrderState.CANCELED)
  } catch (e) {
    console.error('error in handlePaymentCanceled', e)
  }
}

async function handleSucceededSetup(setupIntent: Stripe.SetupIntent) {
  try {
    const stripeID = setupIntent.customer

    if (!stripeID) throw new Error('No customer on Setup Intent')

    const user = await User.findOne({ stripeID })

    if (!user) throw new Error('No User linked to customer')
    if (!setupIntent.payment_method)
      throw new Error('No payment method attached to Setup Intent')

    const paymentMethod = await stripe.paymentMethods.retrieve(
      setupIntent.payment_method.toString()
    )
    // await PaymentProcessing.remove({ setupIntent: setupIntent.id })

    user.defaultPaymentMethod = paymentMethod.type as PaymentMethodOptions
    user.isDefaultPaymentMethodProcessing = false

    await user.save()

    console.log('☑️📝 Successful Payment Method Setup')
  } catch (e) {
    console.error('error', e)
  }
}

async function handleFailedSetup(setupIntent: Stripe.SetupIntent) {
  try {
    console.log(`⛔ SetupIntent ${setupIntent.id} failed or was canceled!`)
    // await PaymentProcessing.remove({ setupIntent: setupIntent.id })

    const stripeID = setupIntent.customer

    if (!stripeID) throw new Error('No customer on Setup Intent')

    await User.updateOne(
      { stripeID },
      { isDefaultPaymentMethodProcessing: false }
    )
  } catch (e) {
    console.error('error', e)
  }
}

async function handleRequireAction(paymentIntent: Stripe.PaymentIntent) {
  console.log(`⚠️ PaymentIntent ${paymentIntent.id} requires action!`)
  console.log('🔒 requiring action from user')
}

async function handlePaymentError(paymentIntent: Stripe.PaymentIntent) {
  console.log(`⛔ PaymentIntent ${paymentIntent.id} failed!`)
  console.log('🔧⛔ Handling Error')
}

webhookRouter.post(
  '/payments',
  express.raw({ type: 'application/json' }),
  (req: Request, res: Response) => {
    let event = req.body

    if (endpointSecret) {
      const signature = req.headers['stripe-signature']

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature!,
          endpointSecret
        )
      } catch (err) {
        console.log(`⚠️ Webhook signature verification failed.`, err.message)
        return res.sendStatus(400)
      }
    }

    const eventData = event.data.object
    // console.log('paymentIntent', paymentIntent)
    console.log('event', event)

    switch (event.type) {
      case 'setup_intent.succeeded':
        handleSucceededSetup(eventData)
        break
      case 'payment_intent.succeeded':
        handleSucceededPayment(eventData)
        break

      case 'setup_intent.requires_action':
        handleRequireAction(eventData)
        break
      case 'payment_intent.requires_action':
        handleRequireAction(eventData)
        break

      case 'setup_intent.setup_failed':
        handleFailedSetup(eventData)
        break
      case 'payment_intent.payment_failed':
        handlePaymentError(eventData)
        break

      case 'setup_intent.canceled':
        handleFailedSetup(eventData)
        break
      case 'payment_intent.canceled':
        handlePaymentCanceled(eventData)
        break
      default:
        console.log(
          `Unhandled event type ${event.type}, PaymentIntent ${eventData.id}`
        )
    }

    return res.send()
  }
)

webhookRouter.post(
  '/bob',
  express.raw({ type: 'application/json' }),
  (req: Request, res: Response) => {
    let event = req.body

    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = req.headers['stripe-signature']
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature!,
          endpointSecret
        )

        // console.log('event', event)
      } catch (err) {
        console.log(`⚠️ Webhook signature verification failed.`, err.message)
        return res.sendStatus(400)
      }
    }

    console.log('event type', event.type)

    return res.send()
  }
)

export { webhookRouter }

/*
################################

✨ payment_intent.canceled
✨ payment_intent.payment_failed
✨ payment_intent.requires_action
✨ payment_intent.succeeded
payment_intent.created
payment_intent.processing

# Charges no needed, all covered in payment_intent
✨ charge.succceeded 
✨ charge.failed
❓ charge.refunded
❓ charge.captured
❓ charge.expired
charge.updated
charge.pending

################################
payment_method.*

payouts.*

transfer.created
transfer.failed
transfer.paid
transfer.reversed
transfer.updated

stripe login
stripe trigger payment_intent.succeeded
stripe listen --forward-to localhost:4000/webhook/payments
*/
