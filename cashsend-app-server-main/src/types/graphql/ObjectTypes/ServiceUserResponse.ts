import { ServiceUser } from '../../../model/ServiceUser'
import { Field, ObjectType } from 'type-graphql'
import { FieldError } from './FieldError'

@ObjectType()
export class ServiceUserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => String, { nullable: true })
  authToken?: String

  @Field(() => ServiceUser, { nullable: true })
  user?: ServiceUser
}
