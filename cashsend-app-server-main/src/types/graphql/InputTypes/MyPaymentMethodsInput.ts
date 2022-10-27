import { Field, InputType } from 'type-graphql'
import { PaymentMethodOptions } from '../Enum/PaymentMethodOptions'

@InputType()
export class MyPaymentMethodsInput {
  @Field(() => PaymentMethodOptions)
  type: PaymentMethodOptions
}
