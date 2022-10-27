import { Field, InputType } from 'type-graphql'

@InputType()
export class EmailPasswordInput {
  @Field()
  email: string

  @Field()
  password: string

  @Field()
  firstName: string

  @Field({ nullable: true })
  lastName?: string
}
