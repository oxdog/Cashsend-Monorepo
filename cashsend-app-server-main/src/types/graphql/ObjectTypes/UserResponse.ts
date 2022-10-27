import { User } from '../../../model/User'
import { Field, ObjectType } from 'type-graphql'
import { FieldError } from './FieldError'

@ObjectType() //can be use as return type of mutation/query
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => String, { nullable: true })
  authToken?: String

  @Field(() => User, { nullable: true })
  user?: User
}
