import { getModelForClass, pre, prop as Property } from '@typegoose/typegoose'
import argon2 from 'argon2'
import { ObjectId } from 'mongodb'
import { Field, ObjectType } from 'type-graphql'
import { PaymentMethodOptions } from '../types/graphql/Enum/PaymentMethodOptions'

@pre<User>('save', async function (next) {
  const user = this

  if (!user.isModified('password') || !user.password) return next()

  user.password = await argon2.hash(user.password)

  next()
})
@ObjectType()
export class User {
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
  stripeID?: string

  @Property({ nullable: true })
  password?: string

  @Property({ type: () => String, default: [] })
  tokens: string[]

  @Property({ default: false })
  facebookOAuth: boolean

  @Property({ default: false })
  googleOAuth: boolean

  @Property({ nullable: true })
  checkHash?: string

  @Property({ nullable: true })
  lastTokenIssuedAt?: Date

  @Field(() => PaymentMethodOptions, { nullable: true })
  @Property({
    enum: PaymentMethodOptions,
    nullable: true,
    validate: (x) => ['card', 'sepa_debit'].includes(x) || !x
  })
  defaultPaymentMethod?: PaymentMethodOptions

  @Field()
  @Property({ default: false })
  isDefaultPaymentMethodProcessing: boolean

  @Property({ type: ObjectId, default: [] })
  orders: ObjectId[]

  @Property({ nullable: true })
  pushToken?: string

  public async comparePassword(password: string) {
    return this.password ? await argon2.verify(this.password, password) : false
  }
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true }
})
