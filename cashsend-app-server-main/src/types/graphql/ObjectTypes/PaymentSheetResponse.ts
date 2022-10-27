import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class PaymentSheetResponse {
  @Field()
  paymentIntent: String

  @Field()
  ephemeralKey: String

  @Field()
  customer: String
}
