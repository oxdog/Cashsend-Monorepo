import {
  DocumentType,
  getModelForClass,
  pre,
  prop as Property,
  Ref
} from '@typegoose/typegoose'
import { ObjectId } from 'mongodb'
import { Field, ObjectType } from 'type-graphql'
import { OrderState } from '../types/Enum/OrderState'
import { OrderType } from '../types/Enum/OrderType'
import { Partner } from './Partner'
import { User } from './User'

@pre<Order>('save', function () {
  if (!this.transferGroup) {
    this.transferGroup = 'ORDER_' + this._id
  }
})
@ObjectType()
export class Order {
  @Field()
  readonly _id: ObjectId

  @Field(() => User)
  @Property({ ref: User, required: true })
  user: Ref<User>

  @Field(() => Partner)
  @Property({ ref: Partner, required: true })
  partner: Ref<Partner>

  @Field()
  @Property({ required: true, enum: OrderType })
  type: OrderType

  @Field()
  @Property({ required: true })
  amount: number

  @Field()
  @Property({ enum: OrderState, default: OrderState.PROCESSING })
  state: OrderState

  @Field(() => String)
  @Property()
  transferGroup: string

  @Field(() => String)
  readonly createdAt: Date

  // @Field()
  // @Property()
  // smartCooler?: SmartCooler

  public async setStateAndSave(this: DocumentType<Order>, state: OrderState) {
    const possibleStates: OrderState[] = [
      OrderState.PROCESSING,
      OrderState.CANCELED,
      OrderState.SUCCEEDED,
      OrderState.FAILED
    ]

    console.log('index of ', state, possibleStates.indexOf(state))

    if (possibleStates.indexOf(state) > 0) {
      this.state = state
      await this.save()
    }
  }
}

export const OrderModel = getModelForClass(Order, {
  schemaOptions: { timestamps: true }
})
