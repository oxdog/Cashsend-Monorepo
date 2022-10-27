import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ConfirmResponse {
  @Field(() => Boolean)
  success: Boolean

  @Field(() => String, { nullable: true })
  error?: String
}
