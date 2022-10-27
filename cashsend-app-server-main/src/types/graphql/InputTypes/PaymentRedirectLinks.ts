import {
  Field,
  InputType
} from 'type-graphql';


@InputType()
export class PaymentRedirectLinks {
  @Field()
  successLink: string;

  @Field()
  cancelLink: string;
}
