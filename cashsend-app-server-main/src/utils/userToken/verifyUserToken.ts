import jwt from 'jsonwebtoken'
import { UserModel } from '../../model/User'
import {
  UserTokenPaylaod,
  UserTokenPaylaodTypes
} from '../../types/typescript/UserTokenPayload'
import { generateUserSecret } from './generateUserSecret'

export const verifyUserToken = async (
  token: string,
  type: UserTokenPaylaodTypes
) => {
  const { _id, checkHash } = jwt.decode(token) as UserTokenPaylaod
  const user = await UserModel.findOne({ _id, checkHash })

  if (!user) throw new Error('User not found')

  const vToken = jwt.verify(token, generateUserSecret(user)) as UserTokenPaylaod

  if (vToken.type !== type) {
    throw new Error('Type not matching')
  }

  user.checkHash = ''
  await user.save()

  return {
    vToken,
    user
  }
}
