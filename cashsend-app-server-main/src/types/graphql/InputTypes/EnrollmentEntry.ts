import { Field, InputType } from 'type-graphql'
import { EnrollmentType } from '../Enum/EnrollmentType'

@InputType()
export class EnrollmentEntryInput {
  @Field({ nullable: true })
  verified?: boolean

  @Field({ nullable: true })
  applyDate?: boolean

  @Field({ nullable: true })
  verifyDate?: boolean

  @Field({ nullable: true })
  type?: EnrollmentType
}
