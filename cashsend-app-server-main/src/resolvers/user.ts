import { UpdateUserInput } from '../types/graphql/InputTypes/UpdateUserInput'
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql'
import { isAuth } from '../middleware/isAuth'
import { User, UserModel } from '../model/User'
import { MyContext } from '../types'
import { UserInputError } from 'apollo-server-express'

const validateUpdate = (update: UpdateUserInput) => {
  console.log('update', update)
  if (update.firstName === '') return false
  if (update.pushToken === '') return false
  return true
}

@Resolver(User)
export class UserResolver {
  // @FieldResolver(() => String)
  // email(@Root() user: User, @Ctx() { req }: MyContext) {
  //   // lock down the email so only the user can fetch his own
  //   if (req.user?._id === user._id) {
  //     return user.email
  //   } else {
  //     return ''
  //   }
  // }

  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  user_me(@Ctx() { req }: MyContext): User | undefined {
    try {
      return req.user!
    } catch (e) {
      console.error('error', e)
      return
    }
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  user_testMiddleWare(): string {
    return 'bob approves'
  }

  @UseMiddleware(isAuth)
  @Mutation(() => User)
  async user_update(
    @Arg('updateRecrod') updateRecord: UpdateUserInput,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    if (!validateUpdate(updateRecord)) {
      throw new UserInputError('Update record seems incorrect')
    }

    const user = req.user!
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      updateRecord
    )

    if (!updatedUser) {
      throw new Error()
    }

    return updatedUser
  }
}
