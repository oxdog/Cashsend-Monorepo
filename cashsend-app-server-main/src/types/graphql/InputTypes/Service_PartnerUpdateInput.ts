import { Field, InputType } from 'type-graphql'
import { ContactPersonInput } from './ContactPerson'
import { EnrollmentsInput } from './Enrollments'
import { LocationInput } from './Location'

@InputType()
export class Service_PartnerUpdateInput {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  connectID?: string

  @Field({ nullable: true })
  about?: string

  @Field(() => EnrollmentsInput, { nullable: true })
  enrollments?: EnrollmentsInput

  @Field(() => LocationInput, { nullable: true })
  location?: LocationInput

  @Field(() => ContactPersonInput, { nullable: true })
  contactPerson?: ContactPersonInput
}
