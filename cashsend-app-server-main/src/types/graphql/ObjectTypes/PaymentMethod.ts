import { Field, ObjectType } from 'type-graphql'
import { PaymentMethodOptions } from '../Enum/PaymentMethodOptions'

@ObjectType()
export class PaymentMethod {
  @Field(() => PaymentMethodOptions)
  type: PaymentMethodOptions

  @Field(() => String, { nullable: true })
  last4?: string

  @Field(() => String, { nullable: true })
  owner?: string
}
