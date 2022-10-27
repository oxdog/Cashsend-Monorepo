import { ObjectId } from 'mongodb'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class CreateCheckoutResponse {
  @Field(() => String)
  checkoutSessionID: string
}

@ObjectType()
export class CreateCheckoutSetupResponse {
  @Field(() => String)
  setupSessionID: string
}

@ObjectType()
export class CreateSetupIntentResponse {
  @Field(() => String, { nullable: true })
  clientSecret?: string

  @Field(() => String, { nullable: true })
  error?: string
}

@ObjectType()
export class OffSessionPaymentResponse {
  @Field(() => String)
  orderID: ObjectId
}
