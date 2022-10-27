import { ApolloServer } from 'apollo-server-express'
import connectRedis from 'connect-redis'
import cors from 'cors'
import 'dotenv-safe/config'
import express from 'express'
import session from 'express-session'
import Redis from 'ioredis'
import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
import * as path from 'path'
import { buildSchema } from 'type-graphql'
import { COOKIE_NAME, __prod__ } from './constants'
import { TypegooseMiddleware } from './middleware/typegoose-middleware'
import { ServiceUserAuthenticationResolver } from './resolvers/authentication/serviceAuthentication'
import { UserAuthenticationResolver } from './resolvers/authentication/userAuthentication'
import { OrderResolver } from './resolvers/order'
import { ServicePartnerResolver } from './resolvers/partner'
import { PaymentResolver } from './resolvers/payment'
import { PaymentDemoResolver } from './resolvers/paymentDemo'
import { ServiceUserResolver } from './resolvers/serviceUser'
import { UserResolver } from './resolvers/user'
import { webhookRouter } from './routers/webhook'
import { MyContext } from './types'
import { ObjectIdScalar } from './types/graphql/ScalarTypes/object-id.scalar'
import { createUserLoader } from './utils/helper/createUserLoader'

const main = async () => {
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })

  const app = express()

  const RedisStore = connectRedis(session)

  const redis = __prod__
    ? new Redis(process.env.REDIS_TLS_URL, {
        tls: { rejectUnauthorized: false }
      })
    : new Redis(process.env.REDIS_URL)

  redis.on('error', console.error)

  app.set('trust proxy', true)

  app.use(
    cors({
      origin:
        (process.env.NODE_ENV || 'development') === 'development'
          ? 'http://localhost:3000'
          : [
              process.env.CORS_WEB_ENDPOINT,
              process.env.CORS_PARTNER_MANAGER,
              process.env.CORS_CHECKOUT_DEMO
            ],
      credentials: true
    })
  )

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        sameSite: __prod__ ? 'none' : 'lax',
        httpOnly: true,
        secure: __prod__
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        OrderResolver,
        PaymentResolver,
        PaymentDemoResolver,
        ServicePartnerResolver,
        ServiceUserAuthenticationResolver,
        ServiceUserResolver,
        UserAuthenticationResolver,
        UserResolver
      ],
      emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
      globalMiddlewares: [TypegooseMiddleware],
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
      validate: false
    }),
    context: ({ req, res }): MyContext => {
      return {
        req,
        res,
        redis,
        userLoader: createUserLoader()
      }
    }
  })

  app.use('/webhook', webhookRouter)
  apolloServer.applyMiddleware({ app, cors: false })

  app.listen(parseInt(process.env.PORT), () => {
    console.log(`Listening on port ${process.env.PORT}`)
  })
}

main()
