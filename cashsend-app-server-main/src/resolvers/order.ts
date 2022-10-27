import { DocumentType } from '@typegoose/typegoose'
import {
  Ctx,
  Field,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware
} from 'type-graphql'
import { isAuth } from '../middleware/isAuth'
import { Order, OrderModel } from '../model/Order'
import { MyContext } from '../types'
import { FieldError } from '../types/graphql/ObjectTypes/FieldError'

@ObjectType()
export class OrderResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => [Order], { nullable: true })
  orders?: DocumentType<Order>[]
}

@Resolver(Order)
export class OrderResolver {
  @UseMiddleware(isAuth)
  @Query(() => OrderResponse)
  async order_GetAllFromUser(
    @Ctx() { req }: MyContext
  ): Promise<OrderResponse> {
    try {
      const user = req.user!

      const orders = await OrderModel.find({
        state: 'succeeded',
        user: user._id
      })
        .sort({ createdAt: -1 })
        .populate('user')
        .populate('partner')

      return { orders }
    } catch (e) {
      console.error('error', e)
      return {
        errors: [
          { field: 'order', message: 'Something failed retrieving orders.' }
        ]
      }
    }
  }
}
