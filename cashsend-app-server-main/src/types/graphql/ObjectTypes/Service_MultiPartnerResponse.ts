import { DocumentType } from '@typegoose/typegoose'
import { Field, ObjectType } from 'type-graphql'
import { Partner } from '../../../model/Partner'
import { FieldError } from './FieldError'

@ObjectType()
export class Service_MultiPartnerResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => [Partner], { nullable: true })
  partner?: DocumentType<Partner>[]
}
