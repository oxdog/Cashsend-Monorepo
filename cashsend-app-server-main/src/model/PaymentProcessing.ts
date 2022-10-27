import { getModelForClass, prop as Property, Ref } from '@typegoose/typegoose'
import { ObjectType } from 'type-graphql'
import { User } from './User'

@ObjectType()
export class PaymentProcessing {
  @Property({ ref: User, required: true })
  user: Ref<User>

  @Property({ required: true })
  stripeID: string

  @Property({ required: true })
  setupIntent: string
}

export const PaymentProcessingModel = getModelForClass(PaymentProcessing, {
  schemaOptions: { timestamps: true }
})
