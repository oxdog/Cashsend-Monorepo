import { getModelForClass, pre, prop as Property } from '@typegoose/typegoose'
import argon2 from 'argon2'
import { ObjectId } from 'mongodb'
import { Field, ObjectType } from 'type-graphql'

@pre<ServiceUser>('save', async function (next) {
  const user = this

  if (!user.isModified('password') || !user.password) return next()

  user.password = await argon2.hash(user.password)

  next()
})
@ObjectType()
export class ServiceUser {
  @Field()
  readonly _id: ObjectId

  @Field(() => String)
  readonly createdAt: Date

  @Field(() => String)
  readonly updatedAt: Date

  @Field()
  @Property()
  firstName: string

  @Field()
  @Property()
  lastName: string

  @Field()
  @Property({ unique: true })
  email: string

  @Property()
  password: string

  @Property({ type: () => String, default: [] })
  tokens: string[]

  public async comparePassword(password: string) {
    return await argon2.verify(this.password, password)
  }
}

export const ServiceUserModel = getModelForClass(ServiceUser, {
  schemaOptions: { timestamps: true }
})
