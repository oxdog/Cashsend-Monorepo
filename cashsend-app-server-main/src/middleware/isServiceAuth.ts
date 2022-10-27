import { MyContext } from '../types'
import { MiddlewareFn } from 'type-graphql'
import jwt from 'jsonwebtoken'
import { ServiceUserModel } from '../model/ServiceUser'
import { AuthenticationError } from 'apollo-server-errors'

export const isServiceAuth: MiddlewareFn<MyContext> = async (
  { context },
  next
) => {
  const { req, res } = context

  try {
    const sessionToken = req.session.authToken
    const headerToken = req.header('Authorization')

    console.log('req.session in middleware', req.session)

    if (!sessionToken && !headerToken) {
      throw new AuthenticationError('No token')
    }

    const token = sessionToken || headerToken.replace('Bearer ', '')

    // console.log('working with token ', token)

    const { userID } = jwt.verify(token, process.env.JWT_SECRET) as {
      userID: string
    }

    const user = await ServiceUserModel.findOne({
      $and: [{ _id: userID }, { tokens: { $elemMatch: { $eq: token } } }]
    })

    if (user) {
      req.serviceUser = user
      req.token = token
      return next()
    } else {
      throw new Error()
    }
  } catch (e) {
    console.error(e)
    return res.status(401).send({ error: 'Please authenticate' })
  }
}
