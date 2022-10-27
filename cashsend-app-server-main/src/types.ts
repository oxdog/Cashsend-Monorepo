import { DocumentType } from '@typegoose/typegoose'
import { Request, Response } from 'express'
import { Session, SessionData } from 'express-session'
import { Redis } from 'ioredis'
import { ServiceUser } from './model/ServiceUser'
import { User } from './model/User'
import { createUserLoader } from './utils/helper/createUserLoader'

export type MyContext = {
  req: Request & {
    user?: DocumentType<User>
    serviceUser?: DocumentType<ServiceUser>
    token?: string
    header?: any
    session?: Session & Partial<SessionData> & { authToken?: string }
  }
  res: Response
  redis: Redis
  userLoader: ReturnType<typeof createUserLoader>
}
