import { Field, InputType } from 'type-graphql'

@InputType()
export class ContactPersonInput {
  @Field({ nullable: true })
  firstName?: string

  @Field({ nullable: true })
  lastName?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  phone?: string
}
