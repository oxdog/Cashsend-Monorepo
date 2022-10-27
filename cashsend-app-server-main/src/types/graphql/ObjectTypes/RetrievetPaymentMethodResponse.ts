import { Field, ObjectType } from 'type-graphql'
import { PaymentMethod } from './PaymentMethod'

@ObjectType()
export class RetrievetPaymentMethodResponse {
  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod?: PaymentMethod

  @Field(() => Boolean, { nullable: true })
  isProcessing?: boolean
}
