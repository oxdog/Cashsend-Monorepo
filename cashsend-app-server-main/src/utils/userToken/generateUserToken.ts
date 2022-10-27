import { DocumentType } from '@typegoose/typegoose'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import { User } from '../../model/User'
import { UserTokenPaylaodTypes } from '../../types/typescript/UserTokenPayload'
import { getRandomCharSet } from '../math/getRandomCharSet'
import { generateUserSecret } from './generateUserSecret'

export const generateUserToken = async (
  user: DocumentType<User>,
  type: UserTokenPaylaodTypes,
  skipIssuedAt: boolean = false
) => {
  const isAllowedToGetEmail =
    !user.lastTokenIssuedAt ||
    moment().diff(user.lastTokenIssuedAt, 'minutes') > 1

  if (!isAllowedToGetEmail) {
    throw new Error('Spammy User')
  }

  const checkHash = getRandomCharSet(5, 5)

  user.checkHash = checkHash
  user.lastTokenIssuedAt = !skipIssuedAt ? new Date() : undefined

  await user.save()

  return jwt.sign(
    { _id: user._id, type, checkHash },
    generateUserSecret(user),
    {
      expiresIn: '10 minutes'
    }
  )
}
