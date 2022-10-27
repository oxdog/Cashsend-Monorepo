import { getModelForClass, pre, prop as Property } from '@typegoose/typegoose'
import argon2 from 'argon2'
import { ObjectId } from 'mongodb'
import { Field, ObjectType } from 'type-graphql'

@pre<PartnerUser>('save', async function (next) {
  const user = this

  if (!user.isModified('password') || !user.password) return next()

  user.password = await argon2.hash(user.password)

  next()
})
@ObjectType()
export class PartnerUser {
  @Field()
  readonly _id: ObjectId

  @Field(() => String)
  readonly createdAt: Date

  @Field(() => String)
  readonly updatedAt: Date

  @Field()
  @Property({ default: false })
  verified: boolean

  @Field()
  @Property()
  firstName!: string

  @Field({ nullable: true })
  @Property()
  lastName?: string

  @Field()
  @Property({ unique: true })
  email!: string

  @Property({ nullable: true })
  connectedID?: string

  @Property({ nullable: true })
  password?: string

  @Property({ type: () => String, default: [] })
  tokens: string[]

  @Property({ nullable: true })
  checkHash?: string

  @Property({ nullable: true })
  lastTokenIssuedAt?: Date

  public async comparePassword(password: string) {
    return this.password ? await argon2.verify(this.password, password) : false
  }
}

export const PartnerUserModel = getModelForClass(PartnerUser, {
  schemaOptions: { timestamps: true }
})
