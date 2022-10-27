import { prop as Property } from '@typegoose/typegoose'
import { Field, ObjectType } from 'type-graphql'
import { EnrollmentType } from '../Enum/EnrollmentType'

@ObjectType()
export class EnrollmentEntry {
  @Field()
  @Property({ default: false })
  verified!: boolean

  @Field()
  @Property()
  applyDate!: boolean

  @Field()
  @Property({ nullable: true })
  verifyDate?: boolean

  @Field(() => EnrollmentType)
  @Property({ enum: EnrollmentType })
  type!: EnrollmentType
}
