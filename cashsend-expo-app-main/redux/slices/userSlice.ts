import {
  RemovePaymentMethodOfTypeDocument,
  RetrievetPaymentMethodDocument,
  RetrievetPaymentMethodQuery,
  UpdateUserMutation,
  UpdateUserMutationVariables
} from '@generated/graphql-react'
import {
  CancelSetupIntentDocument,
  CancelSetupIntentMutation,
  GetDefaultPaymentMethodDocument,
  GetDefaultPaymentMethodQuery,
  PaymentMethodOptions,
  RemovePaymentMethodOfTypeMutation,
  UpdateUserDocument
} from '@generated/graphql-requests'
import { RootState } from '@redux/store'
import {
  Action,
  CaseReducer,
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'
import { apolloClient } from '@utils/createApolloClient'
import { log } from '@utils/logger'

export type DefaultPaymentMethod = {
  last4: string
  type: PaymentMethodOptions
  expiresIn: string
  owner?: string
}

export type ErrorField = {
  field: string
  message: string
}

export interface UserState {
  email?: string
  userID?: string
  firstName?: string
  verified?: boolean
  isDefaultPaymentMethodSetup?: boolean
  isDefaultPaymentMethodProcessing?: boolean
  defaultPaymentMethod?: DefaultPaymentMethod | undefined
  errors?: ErrorField[]
  isLoading?: boolean
  isLoadingPaymentMethod?: boolean
}

export interface UserUpdate {
  firstName?: string
}

type UserAction = {
  payload: UserState
}

const initialState: UserState = {
  verified: false,
  isDefaultPaymentMethodSetup: false,
  isLoading: false
}

const startInitUser = createAsyncThunk(
  'user/initUserHandler',
  async (variables: UserState, thunkAPI) => {
    try {
      const response = await apolloClient.query<GetDefaultPaymentMethodQuery>({
        query: GetDefaultPaymentMethodDocument
      })

      // console.log('response', response)

      const defaultPaymentMethod =
        response.data.pay_getDefaultPaymentMethod.paymentMethod
      const isProcessing =
        response.data.pay_getDefaultPaymentMethod.isProcessing

      // console.log('defaultPaymentMethod', defaultPaymentMethod)

      return {
        ...variables,
        defaultPaymentMethod,
        isDefaultPaymentMethodProcessing: isProcessing
      }
    } catch (e) {
      log.error('user/initUserHandler', e)

      return thunkAPI.rejectWithValue({
        errors: [
          {
            field: 'Init User',
            message: 'Something failed initializing user.'
          }
        ]
      })
    }
  }
)

const startUpdateUser = createAsyncThunk(
  'user/updateUserHandler',
  async (variables: UserUpdate, thunkAPI) => {
    try {
      console.log('variables', variables)
      await apolloClient.mutate<
        UpdateUserMutation,
        UpdateUserMutationVariables
      >({
        mutation: UpdateUserDocument,
        variables: {
          updateRecrod: { ...variables }
        }
      })

      return { ...variables }
    } catch (e) {
      log.error('user/updateUserHandler', e)

      return thunkAPI.rejectWithValue({
        errors: [
          {
            field: 'Update User',
            message: 'Something failed updating the user.'
          }
        ]
      })
    }
  }
)

const startCancelSetup = createAsyncThunk(
  'user/startCancelSetup',
  async (variables: { withReload?: boolean }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as RootState
      const dispatch = thunkAPI.dispatch

      let isDefaultPaymentMethodProcessing = false

      if (state.user.isDefaultPaymentMethodProcessing) {
        const response = await apolloClient.mutate<CancelSetupIntentMutation>({
          mutation: CancelSetupIntentDocument
        })

        isDefaultPaymentMethodProcessing = !response.data?.pay_cancelSetupIntent

        if (variables.withReload) {
          dispatch(startLoadPaymentMethod())
        }
      }

      return {
        isDefaultPaymentMethodProcessing
      }
    } catch (e) {
      log.error('user/startCancelSetup', e)

      return thunkAPI.rejectWithValue({
        errors: [
          {
            field: 'startCancelSetup',
            message: 'Something failed canceling payment method setup.'
          }
        ]
      })
    }
  }
)

const startLoadPaymentMethod = createAsyncThunk(
  'user/loadPaymentMethod',
  async (_, thunkAPI) => {
    try {
      const response = await apolloClient.query<GetDefaultPaymentMethodQuery>({
        query: GetDefaultPaymentMethodDocument,
        fetchPolicy: 'network-only'
      })

      // console.log('response', response)

      const defaultPaymentMethod =
        response.data.pay_getDefaultPaymentMethod.paymentMethod
      const isProcessing =
        response.data.pay_getDefaultPaymentMethod.isProcessing

      // console.log('defaultPaymentMethod', defaultPaymentMethod)

      return {
        defaultPaymentMethod,
        isDefaultPaymentMethodProcessing: isProcessing
      }
    } catch (e) {
      log.error('user/loadPaymentMethod', e)

      return thunkAPI.rejectWithValue({
        errors: [
          {
            field: 'Refresh Users PaymentMethod',
            message: 'Something failed loading default payment method.'
          }
        ]
      })
    }
  }
)

const startFetchPaymentMethod = createAsyncThunk(
  'user/fetchPaymentMethod',
  async (variables: { paymentMethodId: string }, thunkAPI) => {
    try {
      // console.log('refreshing payment method')

      const { paymentMethodId } = variables

      const response = await apolloClient.query<RetrievetPaymentMethodQuery>({
        query: RetrievetPaymentMethodDocument,
        variables: {
          paymentMethodId
        },
        fetchPolicy: 'network-only'
      })

      // console.log('response', response)

      const defaultPaymentMethod =
        response.data.pay_retrievetPaymentMethod.paymentMethod
      const isProcessing = response.data.pay_retrievetPaymentMethod.isProcessing

      // console.log('defaultPaymentMethod', defaultPaymentMethod)

      return {
        defaultPaymentMethod,
        isDefaultPaymentMethodProcessing: isProcessing
      }
    } catch (e) {
      log.error('user/fetchPaymentMethod', e)

      return thunkAPI.rejectWithValue({
        errors: [
          {
            field: 'Refresh Users PaymentMethod',
            message: 'Something failed refreshing payment method.'
          }
        ]
      })
    }
  }
)

const startRemovePaymentMethod = createAsyncThunk(
  'user/removePaymentMethod',
  async (variables: undefined, thunkAPI) => {
    try {
      // console.log('removing payment method')

      const state = thunkAPI.getState() as RootState

      const { defaultPaymentMethod } = state.user

      if (!defaultPaymentMethod) {
        return thunkAPI.rejectWithValue({
          errors: [
            {
              field: 'Refresh Users PaymentMethod',
              message: 'No payment method in the user state'
            }
          ]
        })
      }

      // console.log('defaultPaymentMethod', defaultPaymentMethod)

      await apolloClient.mutate<RemovePaymentMethodOfTypeMutation>({
        mutation: RemovePaymentMethodOfTypeDocument
      })

      return
    } catch (e) {
      log.error('user/removePaymentMethod', e)

      return thunkAPI.rejectWithValue({
        errors: [
          {
            field: 'Refresh Users PaymentMethod',
            message: 'Something failed refreshing payment method.'
          }
        ]
      })
    }
  }
)

const initUserHandler: CaseReducer<UserState, PayloadAction<UserState>> = (
  state,
  action
) => {
  const {
    userID,
    email,
    firstName,
    verified,
    isDefaultPaymentMethodProcessing,
    defaultPaymentMethod
  } = action.payload
  state.userID = userID
  state.email = email
  state.firstName = firstName
  state.verified = verified
  state.isDefaultPaymentMethodSetup =
    defaultPaymentMethod && !isDefaultPaymentMethodProcessing
  state.isDefaultPaymentMethodProcessing = isDefaultPaymentMethodProcessing
  state.defaultPaymentMethod = defaultPaymentMethod
}

const updateUserHandler: CaseReducer<UserState, PayloadAction<UserState>> = (
  state,
  action
) => {
  Object.keys(action.payload).forEach(
    // @ts-ignore
    (key: any) => (state[key] = action.payload[key])
  )
}

const resetUserHandler: CaseReducer<UserState, Action<any>> = (state, _) => {
  state.userID = undefined
  state.email = undefined
  state.firstName = undefined
  state.verified = false
  state.isDefaultPaymentMethodSetup = false
  state.isDefaultPaymentMethodProcessing = false
  state.defaultPaymentMethod = undefined
}

const resolveInitUser = (state: UserState, action: UserAction) => {
  const {
    userID,
    email,
    firstName,
    verified,
    isDefaultPaymentMethodProcessing,
    defaultPaymentMethod
  } = action.payload
  state.userID = userID
  state.email = email
  state.firstName = firstName
  state.verified = verified
  state.isDefaultPaymentMethodSetup =
    defaultPaymentMethod && !isDefaultPaymentMethodProcessing
  state.isDefaultPaymentMethodProcessing = isDefaultPaymentMethodProcessing
  state.defaultPaymentMethod = defaultPaymentMethod
  state.isLoading = false
}

const resolveUpdateUser = (state: UserState, action: UserAction) => {
  const { firstName } = action.payload
  state.firstName = firstName
  state.isLoading = false
}

const resolveCancelSetup = (state: UserState, action: UserAction) => {
  const { isDefaultPaymentMethodProcessing } = action.payload
  state.isDefaultPaymentMethodSetup = isDefaultPaymentMethodProcessing
  state.isLoadingPaymentMethod = false
}

const resolveLoadPaymentMethod = (state: UserState, action: UserAction) => {
  const { defaultPaymentMethod, isDefaultPaymentMethodProcessing = false } =
    action.payload
  state.defaultPaymentMethod = defaultPaymentMethod
  state.isDefaultPaymentMethodSetup =
    defaultPaymentMethod && !isDefaultPaymentMethodProcessing
  state.isDefaultPaymentMethodProcessing = isDefaultPaymentMethodProcessing
  state.isLoadingPaymentMethod = false
}

const resolveRemovePaymentMethod = (state: UserState, action: UserAction) => {
  state.defaultPaymentMethod = undefined
  state.isDefaultPaymentMethodSetup = false
  state.isLoadingPaymentMethod = false
}

const pendingUser = (state: UserState, action: UserAction) => {
  state.isLoading = true
}

const pendingPaymentMethod = (state: UserState, action: UserAction) => {
  state.isLoadingPaymentMethod = true
}

const reject = (state: UserState, action: UserAction) => {
  const { errors } = action.payload
  state.errors = errors ? errors : []

  state.isLoading = false
  state.isLoadingPaymentMethod = false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    initUser: initUserHandler,
    updateUser: updateUserHandler,
    resetUser: resetUserHandler
  },
  extraReducers: {
    [startInitUser.fulfilled.type]: resolveInitUser,
    [startInitUser.pending.type]: pendingUser,
    [startInitUser.rejected.type]: reject,

    [startUpdateUser.fulfilled.type]: resolveUpdateUser,
    [startUpdateUser.pending.type]: pendingUser,
    [startUpdateUser.rejected.type]: reject,

    [startLoadPaymentMethod.fulfilled.type]: resolveLoadPaymentMethod,
    [startLoadPaymentMethod.pending.type]: pendingPaymentMethod,
    [startLoadPaymentMethod.rejected.type]: reject,

    [startCancelSetup.fulfilled.type]: resolveCancelSetup,
    // [startCancelSetup.pending.type]: pendingPaymentMethod,
    [startCancelSetup.rejected.type]: reject,

    [startFetchPaymentMethod.fulfilled.type]: resolveLoadPaymentMethod,
    [startFetchPaymentMethod.pending.type]: pendingPaymentMethod,
    [startFetchPaymentMethod.rejected.type]: reject,

    [startRemovePaymentMethod.fulfilled.type]: resolveRemovePaymentMethod,
    [startRemovePaymentMethod.pending.type]: pendingPaymentMethod,
    [startRemovePaymentMethod.rejected.type]: reject
  }
})

// Action creators are generated for each case reducer function
const { initUser, updateUser, resetUser } = userSlice.actions
const userSelector = (state: RootState) => state.user
export {
  initUser,
  resetUser,
  startCancelSetup,
  startFetchPaymentMethod,
  startInitUser,
  startLoadPaymentMethod,
  startRemovePaymentMethod,
  startUpdateUser,
  updateUser,
  userSelector
}
export default userSlice.reducer
