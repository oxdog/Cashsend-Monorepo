import { prop as Property } from '@typegoose/typegoose'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ContactPerson {
  @Field({ nullable: true })
  @Property({ nullable: true })
  firstName?: string

  @Field({ nullable: true })
  @Property({ nullable: true })
  lastName?: string

  @Field({ nullable: true })
  @Property({ nullable: true })
  email?: string

  @Field({ nullable: true })
  @Property({ nullable: true })
  phone?: string
}
