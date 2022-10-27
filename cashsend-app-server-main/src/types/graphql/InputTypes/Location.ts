import { Field, InputType } from 'type-graphql'

@InputType()
export class LocationInput {
  @Field({ nullable: true })
  country?: string

  @Field({ nullable: true })
  street?: string

  @Field({ nullable: true })
  city?: string

  @Field({ nullable: true })
  state?: string

  @Field({ nullable: true })
  zip?: string
}
