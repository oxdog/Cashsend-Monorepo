import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql'
import { isServiceAuth } from '../middleware/isServiceAuth'
import { ServiceUser } from '../model/ServiceUser'
import { MyContext } from '../types'

@Resolver(ServiceUser)
export class ServiceUserResolver {
  @Query(() => ServiceUser, { nullable: true })
  @UseMiddleware(isServiceAuth)
  serviceUser_me(@Ctx() { req }: MyContext): ServiceUser | undefined {
    try {
      return req.serviceUser!
    } catch (e) {
      console.error('error', e)
      return
    }
  }
}
