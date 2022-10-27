import { MyContext } from '../types'
import { MiddlewareFn } from 'type-graphql'
import jwt from 'jsonwebtoken'
import { UserModel } from '../model/User'
import { AuthenticationError } from 'apollo-server-errors'

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const { req, res } = context

  try {
    console.log(
      '\n\n\n\n\n\n\n context.req.session.authToken',
      req.session.authToken,
      '\n  context.req.header',
      req.header('Authorization'),
      '\n'
    )

    const sessionToken = req.session.authToken
    const headerToken = req.header('Authorization')

    if (!sessionToken && !headerToken) {
      throw new AuthenticationError('No token')
    }

    const token = sessionToken || headerToken.replace('Bearer ', '')

    console.log('Will work with following token:', token, ' \n\n\n\n\n\n\n\n')

    const { userID } = jwt.verify(token, process.env.JWT_SECRET) as {
      userID: string
    }

    const user = await UserModel.findOne({
      $and: [{ _id: userID }, { tokens: { $elemMatch: { $eq: token } } }]
    })

    if (user) {
      req.user = user
      req.token = token
      return next()
    } else {
      throw new Error()
    }
  } catch (e) {
    return res.status(401).send({ error: 'Please authenticate' })
  }
}
