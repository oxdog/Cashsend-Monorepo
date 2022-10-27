//type CE => Confirm Email
//type RP => Reset Password

export type UserTokenPaylaod = {
  _id: string
  checkHash: string
  type: UserTokenPaylaodTypes
  iat: Date
  exp: Date
}

export type UserTokenPaylaodTypes = 'CE' | 'RP'
