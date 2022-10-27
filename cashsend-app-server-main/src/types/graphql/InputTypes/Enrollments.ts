import { Field, InputType } from 'type-graphql'
import { EnrollmentEntryInput } from './EnrollmentEntry'

@InputType()
export class EnrollmentsInput {
  @Field({ nullable: true })
  regular?: EnrollmentEntryInput

  @Field({ nullable: true })
  scanAndPay?: EnrollmentEntryInput

  @Field({ nullable: true })
  hofladen?: EnrollmentEntryInput
}
