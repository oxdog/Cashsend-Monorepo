import { DocumentType } from '@typegoose/typegoose'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from 'type-graphql'
import { COOKIE_NAME } from '../../constants'
import { isAuth } from '../../middleware/isAuth'
import { User, UserModel } from '../../model/User'
import { MyContext } from '../../types'
import { EmailPasswordInput } from '../../types/graphql/InputTypes/UsernamePasswordInput'
import { ConfirmResponse } from '../../types/graphql/ObjectTypes/ConfirmResponse'
import { UserResponse } from '../../types/graphql/ObjectTypes/UserResponse'
import { UserTokenPaylaod } from '../../types/typescript/UserTokenPayload'
import {
  sendConfirmationEmail,
  sendPasswordResetEmail
} from '../../utils/helper/sendEmail'
import stripe from '../../utils/stripe/createStripeCLient'
import { generateUserToken } from '../../utils/userToken/generateUserToken'
import { verifyUserToken } from '../../utils/userToken/verifyUserToken'
import { validatePassword } from '../../utils/validation/validatePassword'
import { validateRegister } from '../../utils/validation/validateRegister'

@Resolver(User)
export class UserAuthenticationResolver {
  @Mutation(() => UserResponse)
  async auth_register(
    @Arg('options') options: EmailPasswordInput
  ): Promise<UserResponse> {
    try {
      const errors = validateRegister(options)

      if (errors.length > 0) {
        return { errors }
      }

      let user: DocumentType<User> | undefined = undefined

      user = await UserModel.create(options)

      const customer = await stripe.customers.create({
        name: options.firstName,
        email: options.email
      })

      user.stripeID = customer.id

      const authToken = jwt.sign(
        { userID: user.id.toString() },
        process.env.JWT_SECRET
      )

      const emailConfirmToken = await generateUserToken(user, 'CE')
      await sendConfirmationEmail(
        options.email,
        options.firstName,
        emailConfirmToken
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

  @Mutation(() => UserResponse)
  async auth_loginEmail(
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<UserResponse> {
    const user = await UserModel.findOne({ email })

    if (!user || !user?.password) {
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

    return { authToken, user }
  }

  @Mutation(() => UserResponse)
  async auth_loginFacebook(@Arg('code') code: string): Promise<UserResponse> {
    try {
      const appID = process.env.FB_APP_IDD
      const clientSecret = process.env.FB_CLIENT_SECRET
      const redirectUrl = process.env.FB_REDIRECT_URL

      const tokenResponse = await axios.get(
        `https://graph.facebook.com/v10.0/oauth/access_token?client_id=${appID}&redirect_uri=${redirectUrl}&client_secret=${clientSecret}&code=${code}`
      )

      const { access_token } = tokenResponse.data

      const path = 'me'
      const response = await axios.get(
        `https://graph.facebook.com/${path}?fields=id%2Cname%2Cemail&access_token=${encodeURIComponent(
          access_token
        )}`
      )

      // const response = await axios.get(
      //   `https://graph.facebook.com/${path}?fields=id%2Cname%2Cfirst_name%2Clast_name%2Cemail&access_token=${encodeURIComponent(
      //     access_token
      //   )}`
      // )

      console.log('facebook data', response.data)

      const {
        email,
        first_name = 'placeholder',
        last_name = 'placeholder'
      } = await response.data
      let user = await UserModel.findOne({ email })

      if (!user) {
        const customer = await stripe.customers.create({
          name: first_name,
          email: email
        })

        user = await UserModel.create({
          firstName: first_name,
          lastName: last_name,
          email,
          verified: true,
          stripeID: customer.id
        })
      }

      const authToken = jwt.sign(
        { userID: user.id.toString() },
        process.env.JWT_SECRET
      )

      user.tokens.push(authToken)
      user.verified = true
      user.facebookOAuth = true

      await user.save()

      return { authToken, user }
    } catch (e) {
      console.log(e)

      return { errors: [{ field: 'Facebook', message: 'Login Error' }] }
    }
  }

  @Mutation(() => UserResponse)
  async auth_loginGoogle(@Arg('token') token: string): Promise<UserResponse> {
    try {
      console.log('google login called')

      let response = await axios.get(
        'https://www.googleapis.com/userinfo/v2/me',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      console.log('response google', response.data)

      const { email, given_name, family_name } = await response.data

      let user = await UserModel.findOne({ email })

      if (!user) {
        const customer = await stripe.customers.create({
          name: given_name,
          email: email
        })

        user = await UserModel.create({
          firstName: given_name,
          lastName: family_name,
          email,
          verified: true,
          stripeID: customer.id
        })
      }

      const authToken = jwt.sign(
        { userID: user.id.toString() },
        process.env.JWT_SECRET
      )

      user.tokens.push(authToken)
      user.verified = true
      user.googleOAuth = true

      await user.save()

      return { authToken, user }
    } catch (e) {
      console.log('error', e)

      return { errors: [{ field: 'Google', message: 'Login Error' }] }
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async auth_logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise(async (resolve) => {
      try {
        const { user: reqUser, token } = req
        const user = await UserModel.findOne({ _id: reqUser?._id })

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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async auth_logoutAll(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise(async (resolve) => {
      try {
        const { user: reqUser } = req
        const user = await UserModel.findOne({ _id: reqUser?._id })

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

  @Mutation(() => ConfirmResponse)
  async auth_confirmEmail(
    @Arg('token') token: string
  ): Promise<ConfirmResponse> {
    try {
      const { user } = await verifyUserToken(token, 'CE')

      user.verified = true
      await user.save()

      return {
        success: true
      }
    } catch (e) {
      return {
        success: false,
        error: 'Email confirmation failed.'
      }
    }
  }

  @Mutation(() => ConfirmResponse)
  async auth_changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string
  ): Promise<ConfirmResponse> {
    try {
      const { user } = await verifyUserToken(token, 'RP')

      if (!validatePassword(newPassword)) {
        return {
          success: false,
          error: 'Password not matching requirements'
        }
      }

      user.password = newPassword
      await user.save()

      return {
        success: true
      }
    } catch (e) {
      console.error('error', e)
      return {
        success: false,
        error: 'Invalid Token'
      }
    }
  }

  @Mutation(() => ConfirmResponse)
  async auth_requestConfirmationEmail(
    @Arg('email') email: string
  ): Promise<ConfirmResponse> {
    try {
      const user = await UserModel.findOne({ email })

      if (user && !user.verified) {
        const token = await generateUserToken(user, 'CE')

        await sendConfirmationEmail(email, user.firstName, token)
      } else {
        throw new Error('Spammy user')
      }

      return {
        success: true
      }
    } catch (e) {
      console.error('error', e)
      return {
        success: true
      }
    }
  }

  @Mutation(() => String)
  async auth_requestPasswordReset(
    @Arg('email') email: string
  ): Promise<String> {
    try {
      const user = await UserModel.findOne({ email })

      if (!user) {
        throw new Error('No user found')
      }

      const token = await generateUserToken(user, 'RP')

      await sendPasswordResetEmail(email, user.firstName, token)

      return token
    } catch (e) {
      console.error('error', e)
      return 'placeholder bob'
    }
  }

  @Mutation(() => ConfirmResponse)
  async auth_resendConfirmationLink(
    @Arg('token') token: string
  ): Promise<ConfirmResponse> {
    try {
      const { _id } = jwt.decode(token) as UserTokenPaylaod
      const user = await UserModel.findOne({ _id })

      if (user && !user.verified) {
        const newToken = await generateUserToken(user, 'CE')

        await sendConfirmationEmail(user.email, user.firstName, newToken)
      } else {
        throw new Error('Spammy user')
      }

      return {
        success: true
      }
    } catch (e) {
      console.error('error', e)
      return {
        success: true
      }
    }
  }

  @Mutation(() => ConfirmResponse)
  async auth_resendPasswordResetLink(
    @Arg('token') token: string
  ): Promise<ConfirmResponse> {
    try {
      const { _id } = jwt.decode(token) as UserTokenPaylaod
      const user = await UserModel.findById(_id)

      if (!user) throw new Error()

      const newToken = await generateUserToken(user, 'RP')
      await sendPasswordResetEmail(user.email, user.firstName, newToken)

      return {
        success: true
      }
    } catch (e) {
      console.error('error', e)
      return {
        success: true
      }
    }
  }
}
