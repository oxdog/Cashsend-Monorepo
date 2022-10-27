import { DocumentType } from '@typegoose/typegoose'
import jwt from 'jsonwebtoken'
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import { COOKIE_NAME } from '../../constants'
import { isAuth } from '../../middleware/isAuth'
import { User, UserModel as PartnerUserModel } from '../../model/User'
import { MyContext } from '../../types'
import { EmailPasswordInput } from '../../types/graphql/InputTypes/UsernamePasswordInput'
import { UserResponse } from '../../types/graphql/ObjectTypes/UserResponse'
import { validateRegister } from '../../utils/validation/validateRegister'

// ! Copy pasted from userAuthentication, not tried if it works

@Resolver(User)
export class PartnerAuthenticationResolver {
  @Mutation(() => UserResponse)
  async partnerAuth_register(
    @Arg('options') options: EmailPasswordInput
  ): Promise<UserResponse> {
    try {
      const errors = validateRegister(options)

      if (errors.length > 0) {
        return { errors }
      }

      let user: DocumentType<User> | undefined = undefined

      user = await PartnerUserModel.create(options)

      const authToken = jwt.sign(
        { userID: user.id.toString() },
        process.env.JWT_SECRET
      )

      // const emailConfirmToken = await generateUserToken(user, 'CE')
      // await sendConfirmationEmail(
      //   options.email,
      //   options.firstName,
      //   emailConfirmToken
      // )

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

  @Mutation(() => UserResponse)
  async partnerAuth_loginEmail(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await PartnerUserModel.findOne({ email })

    if (!user) {
      return {
        errors: [
          {
            field: 'login',
            message: 'Invalid Login'
          }
        ]
      }
    }

    const isValid = await user.comparePassword(password)

    if (!isValid) {
      return {
        errors: [
          {
            field: 'login',
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
  @UseMiddleware(isAuth)
  async partnerAuth_logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        const { user: reqUser, token } = req
        const user = await PartnerUserModel.findOne({ _id: reqUser?._id })

        if (user) {
          user.tokens = user.tokens.filter((t: string) => t !== token)
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
