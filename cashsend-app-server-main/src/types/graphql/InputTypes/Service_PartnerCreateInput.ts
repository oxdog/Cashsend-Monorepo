import { Field, InputType } from 'type-graphql'

@InputType()
export class Service_PartnerCreateInput {
  @Field()
  name: string

  @Field()
  email: string

  @Field({ nullable: true })
  connectID?: string
}
