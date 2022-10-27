import { DocumentType } from '@typegoose/typegoose'
import jwt from 'jsonwebtoken'
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import { COOKIE_NAME } from '../../constants'
import { isServiceAuth } from '../../middleware/isServiceAuth'
import { ServiceUser, ServiceUserModel } from '../../model/ServiceUser'
import { MyContext } from '../../types'
import { EmailPasswordInput } from '../../types/graphql/InputTypes/UsernamePasswordInput'
import { ServiceUserResponse } from '../../types/graphql/ObjectTypes/ServiceUserResponse'
import { validateRegister } from '../../utils/validation/validateRegister'

@Resolver(ServiceUser)
export class ServiceUserAuthenticationResolver {
  @Mutation(() => ServiceUserResponse)
  async serviceAuth_register(
    @Arg('options') options: EmailPasswordInput
  ): Promise<ServiceUserResponse> {
    try {
      const errors = validateRegister(options)

      if (errors.length > 0) {
        return { errors }
      }

      let user: DocumentType<ServiceUser> | undefined = undefined

      user = await ServiceUserModel.create(options)

      const authToken = jwt.sign(
        { userID: user.id.toString() },
        process.env.JWT_SECRET
      )

      return { authToken, user }
    } catch (e) {
      console.error('error', e.code)

      if (e.code.toString() === '11000') {
        return {
          errors: [
            {
              field: 'email_taken',
              message: 'Email already taken'
            }
          ]
        }
      } else {
        return {
          errors: [
            {
              field: 'generic',
              message: 'Registration failed. No User generated.'
            }
          ]
        }
      }
    }
  }

  @Mutation(() => ServiceUserResponse)
  async serviceAuth_loginEmail(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<ServiceUserResponse> {
    const user = await ServiceUserModel.findOne({ email })

    if (!user) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Invalid Login'
          }
        ]
      }
    }

    const isValid = await user.comparePassword(password)
    console.log('isValid', isValid)

    if (!isValid) {
      return {
        errors: [
          {
            field: 'email',
            message: 'Invalid Login'
          }
        ]
      }
    }

    const authToken = jwt.sign(
      { userID: user._id.toString() },
      process.env.JWT_SECRET
    )

    if (user.tokens) {
      user.tokens.push(authToken)
    } else {
      user.tokens = [authToken]
    }

    await user.save()

    req.session.authToken = authToken

    return { authToken, user }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isServiceAuth)
  async serviceAuth_logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        const { serviceUser: reqUser } = req
        const user = await ServiceUserModel.findOne({ _id: reqUser?._id })

        if (user) {
          user.tokens = []
          await user.save()
        }

        res.clearCookie(COOKIE_NAME)
        req.session.destroy((error) => {
          if (error) {
            resolve(false)
          }
          resolve(true)
        })

        resolve(true)
      } catch (e) {
        resolve(false)
      }
    })
  }
}
