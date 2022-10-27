import { prop as Property } from '@typegoose/typegoose'
import { Field, ObjectType } from 'type-graphql'
import { EnrollmentEntry } from './EnrollmentEntry'

@ObjectType()
export class Enrollments {
  @Field(() => EnrollmentEntry, { nullable: true })
  @Property({ nullable: true })
  regular?: EnrollmentEntry

  @Field(() => EnrollmentEntry, { nullable: true })
  @Property({ nullable: true })
  scanAndPay?: EnrollmentEntry

  @Field(() => EnrollmentEntry, { nullable: true })
  @Property({ nullable: true })
  hofladen?: EnrollmentEntry
}
