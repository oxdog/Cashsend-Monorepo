import { gql } from '@apollo/client'
import * as Apollo from '@apollo/client'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
const defaultOptions = {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** Mongo object id scalar type */
  ObjectId: any
}

export type ConfirmResponse = {
  __typename?: 'ConfirmResponse'
  success: Scalars['Boolean']
  error?: Maybe<Scalars['String']>
}

export type ContactPerson = {
  __typename?: 'ContactPerson'
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
}

export type ContactPersonInput = {
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
}

export type CreateCheckoutResponse = {
  __typename?: 'CreateCheckoutResponse'
  checkoutSessionID: Scalars['String']
}

export type CreateCheckoutSetupResponse = {
  __typename?: 'CreateCheckoutSetupResponse'
  setupSessionID: Scalars['String']
}

export type CreateSetupIntentResponse = {
  __typename?: 'CreateSetupIntentResponse'
  clientSecret?: Maybe<Scalars['String']>
  error?: Maybe<Scalars['String']>
}

export type EmailPasswordInput = {
  email: Scalars['String']
  password: Scalars['String']
  firstName: Scalars['String']
  lastName?: Maybe<Scalars['String']>
}

export type EnrollmentEntry = {
  __typename?: 'EnrollmentEntry'
  verified: Scalars['Boolean']
  applyDate: Scalars['Boolean']
  verifyDate: Scalars['Boolean']
  type: EnrollmentType
}

export type EnrollmentEntryInput = {
  verified?: Maybe<Scalars['Boolean']>
  applyDate?: Maybe<Scalars['Boolean']>
  verifyDate?: Maybe<Scalars['Boolean']>
  type?: Maybe<Scalars['String']>
}

/** Type of Enrollment */
export enum EnrollmentType {
  Regular = 'REGULAR',
  ScanAndPay = 'SCAN_AND_PAY',
  Hofladen = 'HOFLADEN',
}

export type Enrollments = {
  __typename?: 'Enrollments'
  regular?: Maybe<EnrollmentEntry>
  scanAndPay?: Maybe<EnrollmentEntry>
  hofladen?: Maybe<EnrollmentEntry>
}

export type EnrollmentsInput = {
  regular?: Maybe<EnrollmentEntryInput>
  scanAndPay?: Maybe<EnrollmentEntryInput>
  hofladen?: Maybe<EnrollmentEntryInput>
}

export type FieldError = {
  __typename?: 'FieldError'
  field: Scalars['String']
  message: Scalars['String']
}

export type Location = {
  __typename?: 'Location'
  country: Scalars['String']
  street: Scalars['String']
  city: Scalars['String']
  state: Scalars['String']
  zip: Scalars['String']
}

export type LocationInput = {
  country?: Maybe<Scalars['String']>
  street?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  state?: Maybe<Scalars['String']>
  zip?: Maybe<Scalars['String']>
}

export type Mutation = {
  __typename?: 'Mutation'
  serviceAuth_register: ServiceUserResponse
  serviceAuth_loginEmail: ServiceUserResponse
  serviceAuth_logout: Scalars['Boolean']
  auth_register: UserResponse
  auth_loginEmail: UserResponse
  auth_loginFacebook: UserResponse
  auth_loginGoogle: UserResponse
  auth_logout: Scalars['Boolean']
  auth_logoutAll: Scalars['Boolean']
  auth_confirmEmail: ConfirmResponse
  auth_changePassword: ConfirmResponse
  auth_requestConfirmationEmail: ConfirmResponse
  auth_requestPasswordReset: Scalars['String']
  auth_resendConfirmationLink: ConfirmResponse
  auth_resendPasswordResetLink: ConfirmResponse
  service_createPartner: Service_SinglePartnerResponse
  service_updatePartner: Service_SinglePartnerResponse
  service_deletePartner: Service_SinglePartnerResponse
  pay_removePaymentMethodOfType: Scalars['Boolean']
  pay_changeDefaultPaymentMethod: Scalars['Boolean']
  pay_createSetupIntent: CreateSetupIntentResponse
  pay_cancelSetupIntent: Scalars['Boolean']
  pay_offSessionPayment: OffSessionPaymentResponse
  pay_createPaymentSheet: PaymentSheetResponse
  pay_createCheckout: CreateCheckoutResponse
  pay_createCheckoutNonCustomer: CreateCheckoutResponse
  pay_createCheckoutSetup: CreateCheckoutSetupResponse
  user_update: User
}

export type MutationServiceAuth_RegisterArgs = {
  options: EmailPasswordInput
}

export type MutationServiceAuth_LoginEmailArgs = {
  password: Scalars['String']
  email: Scalars['String']
}

export type MutationAuth_RegisterArgs = {
  options: EmailPasswordInput
}

export type MutationAuth_LoginEmailArgs = {
  password: Scalars['String']
  email: Scalars['String']
}

export type MutationAuth_LoginFacebookArgs = {
  code: Scalars['String']
}

export type MutationAuth_LoginGoogleArgs = {
  token: Scalars['String']
}

export type MutationAuth_ConfirmEmailArgs = {
  token: Scalars['String']
}

export type MutationAuth_ChangePasswordArgs = {
  newPassword: Scalars['String']
  token: Scalars['String']
}

export type MutationAuth_RequestConfirmationEmailArgs = {
  email: Scalars['String']
}

export type MutationAuth_RequestPasswordResetArgs = {
  email: Scalars['String']
}

export type MutationAuth_ResendConfirmationLinkArgs = {
  token: Scalars['String']
}

export type MutationAuth_ResendPasswordResetLinkArgs = {
  token: Scalars['String']
}

export type MutationService_CreatePartnerArgs = {
  record: Service_PartnerCreateInput
}

export type MutationService_UpdatePartnerArgs = {
  record: Service_PartnerUpdateInput
  _id: Scalars['ObjectId']
}

export type MutationService_DeletePartnerArgs = {
  _id: Scalars['ObjectId']
}

export type MutationPay_RemovePaymentMethodOfTypeArgs = {
  type?: Maybe<PaymentMethodOptions>
}

export type MutationPay_ChangeDefaultPaymentMethodArgs = {
  type: PaymentMethodOptions
}

export type MutationPay_OffSessionPaymentArgs = {
  partnerID: Scalars['ObjectId']
  amount: Scalars['Float']
}

export type MutationPay_CreatePaymentSheetArgs = {
  partnerID: Scalars['ObjectId']
  amount: Scalars['Float']
}

export type MutationPay_CreateCheckoutArgs = {
  redirect?: Maybe<PaymentRedirectLinks>
  partnerID: Scalars['ObjectId']
  amount: Scalars['Float']
}

export type MutationPay_CreateCheckoutNonCustomerArgs = {
  redirect?: Maybe<PaymentRedirectLinks>
  partnerID: Scalars['ObjectId']
  email: Scalars['String']
  amount: Scalars['Float']
}

export type MutationUser_UpdateArgs = {
  updateRecrod: UpdateUserInput
}

export type OffSessionPaymentResponse = {
  __typename?: 'OffSessionPaymentResponse'
  orderID: Scalars['String']
}

export type Order = {
  __typename?: 'Order'
  _id: Scalars['ObjectId']
  user: User
  partner: Partner
  type: Scalars['String']
  amount: Scalars['Float']
  state: Scalars['String']
  transferGroup: Scalars['String']
  createdAt: Scalars['String']
}

export type OrderResponse = {
  __typename?: 'OrderResponse'
  errors?: Maybe<Array<FieldError>>
  orders?: Maybe<Array<Order>>
}

export type Partner = {
  __typename?: 'Partner'
  _id: Scalars['ObjectId']
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
  name: Scalars['String']
  email: Scalars['String']
  connectID?: Maybe<Scalars['String']>
  about?: Maybe<Scalars['String']>
  enrollments?: Maybe<Enrollments>
  location?: Maybe<Location>
  contactPerson?: Maybe<ContactPerson>
}

export type PaymentMethod = {
  __typename?: 'PaymentMethod'
  type: PaymentMethodOptions
  last4?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
}

/** The PaymentMethod Types a Customer can save to his account */
export enum PaymentMethodOptions {
  Card = 'CARD',
  Sepa = 'SEPA',
}

export type PaymentRedirectLinks = {
  successLink: Scalars['String']
  cancelLink: Scalars['String']
}

export type PaymentSheetResponse = {
  __typename?: 'PaymentSheetResponse'
  paymentIntent: Scalars['String']
  ephemeralKey: Scalars['String']
  customer: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  order_GetAllFromUser: OrderResponse
  service_PartnerFindById: Service_SinglePartnerResponse
  service_PartnerGetAll: Service_MultiPartnerResponse
  pay_stripePublicKey: Scalars['String']
  pay_validateDefaultPaymentMethod: Scalars['Boolean']
  pay_getDefaultPaymentMethod: RetrievetPaymentMethodResponse
  pay_retrievetPaymentMethod: RetrievetPaymentMethodResponse
  serviceUser_me?: Maybe<ServiceUser>
  user_me?: Maybe<User>
  user_testMiddleWare: Scalars['String']
}

export type QueryService_PartnerFindByIdArgs = {
  _id: Scalars['ObjectId']
}

export type QueryPay_RetrievetPaymentMethodArgs = {
  paymentMethodId: Scalars['String']
}

export type RetrievetPaymentMethodResponse = {
  __typename?: 'RetrievetPaymentMethodResponse'
  paymentMethod?: Maybe<PaymentMethod>
  isProcessing?: Maybe<Scalars['Boolean']>
}

export type ServiceUser = {
  __typename?: 'ServiceUser'
  _id: Scalars['ObjectId']
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
  firstName: Scalars['String']
  lastName: Scalars['String']
  email: Scalars['String']
}

export type ServiceUserResponse = {
  __typename?: 'ServiceUserResponse'
  errors?: Maybe<Array<FieldError>>
  authToken?: Maybe<Scalars['String']>
  user?: Maybe<ServiceUser>
}

export type Service_MultiPartnerResponse = {
  __typename?: 'Service_MultiPartnerResponse'
  errors?: Maybe<Array<FieldError>>
  partner?: Maybe<Array<Partner>>
}

export type Service_PartnerCreateInput = {
  name: Scalars['String']
  email: Scalars['String']
  connectID?: Maybe<Scalars['String']>
}

export type Service_PartnerUpdateInput = {
  name?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  connectID?: Maybe<Scalars['String']>
  about?: Maybe<Scalars['String']>
  enrollments?: Maybe<EnrollmentsInput>
  location?: Maybe<LocationInput>
  contactPerson?: Maybe<ContactPersonInput>
}

export type Service_SinglePartnerResponse = {
  __typename?: 'Service_SinglePartnerResponse'
  errors?: Maybe<Array<FieldError>>
  partner?: Maybe<Partner>
}

export type UpdateUserInput = {
  pushToken?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
}

export type User = {
  __typename?: 'User'
  _id: Scalars['ObjectId']
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
  verified: Scalars['Boolean']
  firstName: Scalars['String']
  lastName?: Maybe<Scalars['String']>
  email: Scalars['String']
  defaultPaymentMethod?: Maybe<PaymentMethodOptions>
  isDefaultPaymentMethodProcessing: Scalars['Boolean']
}

export type UserResponse = {
  __typename?: 'UserResponse'
  errors?: Maybe<Array<FieldError>>
  authToken?: Maybe<Scalars['String']>
  user?: Maybe<User>
}

export type RegularErrorFragment = { __typename?: 'FieldError' } & Pick<
  FieldError,
  'field' | 'message'
>

export type RegularUserFragment = { __typename?: 'User' } & Pick<
  User,
  '_id' | 'firstName'
>

export type RegularUserResponseFragment = { __typename?: 'UserResponse' } & {
  errors?: Maybe<Array<{ __typename?: 'FieldError' } & RegularErrorFragment>>
  user?: Maybe<{ __typename?: 'User' } & RegularUserFragment>
}

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String']
  newPassword: Scalars['String']
}>

export type ChangePasswordMutation = { __typename?: 'Mutation' } & {
  auth_changePassword: { __typename?: 'ConfirmResponse' } & Pick<
    ConfirmResponse,
    'success' | 'error'
  >
}

export type ConfirmEmailMutationVariables = Exact<{
  token: Scalars['String']
}>

export type ConfirmEmailMutation = { __typename?: 'Mutation' } & {
  auth_confirmEmail: { __typename?: 'ConfirmResponse' } & Pick<
    ConfirmResponse,
    'success' | 'error'
  >
}

export type CreateCheckoutMutationVariables = Exact<{
  amount: Scalars['Float']
  email: Scalars['String']
  partnerID: Scalars['ObjectId']
}>

export type CreateCheckoutMutation = { __typename?: 'Mutation' } & {
  pay_createCheckoutNonCustomer: { __typename?: 'CreateCheckoutResponse' } & Pick<
    CreateCheckoutResponse,
    'checkoutSessionID'
  >
}

export type ResendConfirmationLinkMutationVariables = Exact<{
  token: Scalars['String']
}>

export type ResendConfirmationLinkMutation = { __typename?: 'Mutation' } & {
  auth_resendConfirmationLink: { __typename?: 'ConfirmResponse' } & Pick<
    ConfirmResponse,
    'success' | 'error'
  >
}

export type ResendPasswordResetLinkMutationVariables = Exact<{
  token: Scalars['String']
}>

export type ResendPasswordResetLinkMutation = { __typename?: 'Mutation' } & {
  auth_resendConfirmationLink: { __typename?: 'ConfirmResponse' } & Pick<
    ConfirmResponse,
    'success' | 'error'
  >
}

export type StripePublicKeyQueryVariables = Exact<{ [key: string]: never }>

export type StripePublicKeyQuery = { __typename?: 'Query' } & Pick<
  Query,
  'pay_stripePublicKey'
>

export type MeQueryVariables = Exact<{ [key: string]: never }>

export type MeQuery = { __typename?: 'Query' } & {
  user_me?: Maybe<{ __typename?: 'User' } & RegularUserFragment>
}

export const RegularErrorFragmentDoc = gql`
  fragment RegularError on FieldError {
    field
    message
  }
`
export const RegularUserFragmentDoc = gql`
  fragment RegularUser on User {
    _id
    firstName
  }
`
export const RegularUserResponseFragmentDoc = gql`
  fragment RegularUserResponse on UserResponse {
    errors {
      ...RegularError
    }
    user {
      ...RegularUser
    }
  }
  ${RegularErrorFragmentDoc}
  ${RegularUserFragmentDoc}
`
export const ChangePasswordDocument = gql`
  mutation ChangePassword($token: String!, $newPassword: String!) {
    auth_changePassword(token: $token, newPassword: $newPassword) {
      success
      error
    }
  }
`
export type ChangePasswordMutationFn = Apollo.MutationFunction<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(
    ChangePasswordDocument,
    options
  )
}
export type ChangePasswordMutationHookResult = ReturnType<
  typeof useChangePasswordMutation
>
export type ChangePasswordMutationResult =
  Apollo.MutationResult<ChangePasswordMutation>
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<
  ChangePasswordMutation,
  ChangePasswordMutationVariables
>
export const ConfirmEmailDocument = gql`
  mutation ConfirmEmail($token: String!) {
    auth_confirmEmail(token: $token) {
      success
      error
    }
  }
`
export type ConfirmEmailMutationFn = Apollo.MutationFunction<
  ConfirmEmailMutation,
  ConfirmEmailMutationVariables
>

/**
 * __useConfirmEmailMutation__
 *
 * To run a mutation, you first call `useConfirmEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmEmailMutation, { data, loading, error }] = useConfirmEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useConfirmEmailMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ConfirmEmailMutation,
    ConfirmEmailMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<ConfirmEmailMutation, ConfirmEmailMutationVariables>(
    ConfirmEmailDocument,
    options
  )
}
export type ConfirmEmailMutationHookResult = ReturnType<
  typeof useConfirmEmailMutation
>
export type ConfirmEmailMutationResult = Apollo.MutationResult<ConfirmEmailMutation>
export type ConfirmEmailMutationOptions = Apollo.BaseMutationOptions<
  ConfirmEmailMutation,
  ConfirmEmailMutationVariables
>
export const CreateCheckoutDocument = gql`
  mutation CreateCheckout($amount: Float!, $email: String!, $partnerID: ObjectId!) {
    pay_createCheckoutNonCustomer(
      amount: $amount
      email: $email
      partnerID: $partnerID
    ) {
      checkoutSessionID
    }
  }
`
export type CreateCheckoutMutationFn = Apollo.MutationFunction<
  CreateCheckoutMutation,
  CreateCheckoutMutationVariables
>

/**
 * __useCreateCheckoutMutation__
 *
 * To run a mutation, you first call `useCreateCheckoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCheckoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCheckoutMutation, { data, loading, error }] = useCreateCheckoutMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      email: // value for 'email'
 *      partnerID: // value for 'partnerID'
 *   },
 * });
 */
export function useCreateCheckoutMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCheckoutMutation,
    CreateCheckoutMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<CreateCheckoutMutation, CreateCheckoutMutationVariables>(
    CreateCheckoutDocument,
    options
  )
}
export type CreateCheckoutMutationHookResult = ReturnType<
  typeof useCreateCheckoutMutation
>
export type CreateCheckoutMutationResult =
  Apollo.MutationResult<CreateCheckoutMutation>
export type CreateCheckoutMutationOptions = Apollo.BaseMutationOptions<
  CreateCheckoutMutation,
  CreateCheckoutMutationVariables
>
export const ResendConfirmationLinkDocument = gql`
  mutation ResendConfirmationLink($token: String!) {
    auth_resendConfirmationLink(token: $token) {
      success
      error
    }
  }
`
export type ResendConfirmationLinkMutationFn = Apollo.MutationFunction<
  ResendConfirmationLinkMutation,
  ResendConfirmationLinkMutationVariables
>

/**
 * __useResendConfirmationLinkMutation__
 *
 * To run a mutation, you first call `useResendConfirmationLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendConfirmationLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendConfirmationLinkMutation, { data, loading, error }] = useResendConfirmationLinkMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useResendConfirmationLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ResendConfirmationLinkMutation,
    ResendConfirmationLinkMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    ResendConfirmationLinkMutation,
    ResendConfirmationLinkMutationVariables
  >(ResendConfirmationLinkDocument, options)
}
export type ResendConfirmationLinkMutationHookResult = ReturnType<
  typeof useResendConfirmationLinkMutation
>
export type ResendConfirmationLinkMutationResult =
  Apollo.MutationResult<ResendConfirmationLinkMutation>
export type ResendConfirmationLinkMutationOptions = Apollo.BaseMutationOptions<
  ResendConfirmationLinkMutation,
  ResendConfirmationLinkMutationVariables
>
export const ResendPasswordResetLinkDocument = gql`
  mutation ResendPasswordResetLink($token: String!) {
    auth_resendConfirmationLink(token: $token) {
      success
      error
    }
  }
`
export type ResendPasswordResetLinkMutationFn = Apollo.MutationFunction<
  ResendPasswordResetLinkMutation,
  ResendPasswordResetLinkMutationVariables
>

/**
 * __useResendPasswordResetLinkMutation__
 *
 * To run a mutation, you first call `useResendPasswordResetLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendPasswordResetLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendPasswordResetLinkMutation, { data, loading, error }] = useResendPasswordResetLinkMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useResendPasswordResetLinkMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ResendPasswordResetLinkMutation,
    ResendPasswordResetLinkMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<
    ResendPasswordResetLinkMutation,
    ResendPasswordResetLinkMutationVariables
  >(ResendPasswordResetLinkDocument, options)
}
export type ResendPasswordResetLinkMutationHookResult = ReturnType<
  typeof useResendPasswordResetLinkMutation
>
export type ResendPasswordResetLinkMutationResult =
  Apollo.MutationResult<ResendPasswordResetLinkMutation>
export type ResendPasswordResetLinkMutationOptions = Apollo.BaseMutationOptions<
  ResendPasswordResetLinkMutation,
  ResendPasswordResetLinkMutationVariables
>
export const StripePublicKeyDocument = gql`
  query StripePublicKey {
    pay_stripePublicKey
  }
`

/**
 * __useStripePublicKeyQuery__
 *
 * To run a query within a React component, call `useStripePublicKeyQuery` and pass it any options that fit your needs.
 * When your component renders, `useStripePublicKeyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStripePublicKeyQuery({
 *   variables: {
 *   },
 * });
 */
export function useStripePublicKeyQuery(
  baseOptions?: Apollo.QueryHookOptions<
    StripePublicKeyQuery,
    StripePublicKeyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<StripePublicKeyQuery, StripePublicKeyQueryVariables>(
    StripePublicKeyDocument,
    options
  )
}
export function useStripePublicKeyLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    StripePublicKeyQuery,
    StripePublicKeyQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<StripePublicKeyQuery, StripePublicKeyQueryVariables>(
    StripePublicKeyDocument,
    options
  )
}
export type StripePublicKeyQueryHookResult = ReturnType<
  typeof useStripePublicKeyQuery
>
export type StripePublicKeyLazyQueryHookResult = ReturnType<
  typeof useStripePublicKeyLazyQuery
>
export type StripePublicKeyQueryResult = Apollo.QueryResult<
  StripePublicKeyQuery,
  StripePublicKeyQueryVariables
>
export const MeDocument = gql`
  query Me {
    user_me {
      ...RegularUser
    }
  }
  ${RegularUserFragmentDoc}
`

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export function useMeLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options)
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>
