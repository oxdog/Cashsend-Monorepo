import { Field, ObjectType } from 'type-graphql'
import { prop as Property } from '@typegoose/typegoose'

@ObjectType()
export class Location {
  @Field()
  @Property()
  country!: string

  @Field()
  @Property()
  street!: string

  @Field()
  @Property()
  city!: string

  @Field()
  @Property()
  state!: string

  @Field()
  @Property()
  zip!: string
}
