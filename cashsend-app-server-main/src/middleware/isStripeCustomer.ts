import { AuthenticationError } from 'apollo-server-express'
import { MiddlewareFn } from 'type-graphql'
import { MyContext } from '../types'

export const isStripeCustomer: MiddlewareFn<MyContext> = async (
  { context },
  next
) => {
  try {
    const user = context.req.user!
    if (!user.stripeID) {
      throw new AuthenticationError('No stripe customer linked to user')
    }

    return next()
  } catch (e) {
    context.res.status(401).send({ error: 'Please authenticate' })
  }
}
