import { getModelForClass, prop as Property } from '@typegoose/typegoose'
import { ObjectId } from 'mongodb'
import { Field, ObjectType } from 'type-graphql'
import { Location } from '../types/graphql/ObjectTypes/Location'
import { Enrollments } from '../types/graphql/ObjectTypes/Enrollments'
import { ContactPerson } from '../types/graphql/ObjectTypes/ContactPerson'

@ObjectType()
export class Partner {
  @Field()
  readonly _id: ObjectId

  @Field(() => String)
  readonly createdAt: Date

  @Field(() => String)
  readonly updatedAt: Date

  @Field()
  @Property()
  name!: string

  @Field()
  @Property({ unique: true })
  email!: string

  @Field({ nullable: true })
  @Property({ nullable: true })
  connectID?: string

  @Field({ nullable: true })
  @Property({ nullable: true })
  about?: string

  @Field(() => Enrollments, { nullable: true })
  @Property({
    type: () => Enrollments,
    nullable: true,
    _id: false
  })
  enrollments?: Enrollments

  @Field(() => Location, { nullable: true })
  @Property({ type: () => Location, nullable: true, _id: false })
  location?: Location

  @Field(() => ContactPerson, { nullable: true })
  @Property({
    type: () => ContactPerson,
    nullable: true,
    _id: false
  })
  contactPerson?: ContactPerson
}

export const PartnerModel = getModelForClass(Partner, {
  schemaOptions: { timestamps: true }
})
