import { Stripe } from 'stripe'

const stripe = new Stripe(
  (process.env.NODE_ENV || 'development') === 'development'
    ? process.env.STRIPE_SECRET_KEY_TEST!
    : process.env.STRIPE_SECRET_KEY!,
  {
    apiVersion: '2020-08-27',
    maxNetworkRetries: 3,
    typescript: true
  }
)

export const getStripeInTestMode = () =>
  new Stripe(process.env.STRIPE_SECRET_KEY_TEST!, {
    apiVersion: '2020-08-27',
    maxNetworkRetries: 3,
    typescript: true
  })

export default stripe
