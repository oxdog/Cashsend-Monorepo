import { Field, InputType } from 'type-graphql'

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  pushToken?: string

  @Field({ nullable: true })
  firstName?: string
}
