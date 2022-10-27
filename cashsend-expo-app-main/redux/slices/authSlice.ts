import {
  LoginEmailDocument,
  LoginEmailMutation,
  LoginEmailMutationVariables,
  LoginFacebookDocument,
  LoginFacebookMutation,
  LoginFacebookMutationVariables,
  LoginGoogleDocument,
  LoginGoogleMutation,
  LoginGoogleMutationVariables,
  LogoutAllDocument,
  LogoutAllMutation,
  MeDocument,
  MeQuery,
  RegisterDocument,
  RegisterMutation,
  RegisterMutationVariables,
  RequestConfirmationEmailDocument,
  RequestConfirmationEmailMutation,
  RequestConfirmationEmailMutationVariables
} from '@generated/graphql-requests'
import { RootState } from '@redux/store'
import { CaseReducer, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apolloClient } from '@utils/createApolloClient'
import { log } from '@utils/logger'
import * as SecureStore from 'expo-secure-store'
import { initUser, resetUser, startInitUser, UserState } from './userSlice'

export enum AuthError {
  REGISTER = 'register',
  REGISTER_EMAIL_TAKEN = 'register_email_taken',
  LOGIN_EMAIL = 'login_email',
  LOGIN_GOOGLE = 'login_google',
  LOGIN_FACEBOOK = 'login_facebook',
  LOGOUT = 'logout',
  INIT = 'init',
  CONFIRM_EMAIL = 'confirm_email',
  NOT_FOUND = 'not_found',
  NOT_AUTHENTICATED = 'not_authenticated'
}

export interface AuthState {
  isLoading: boolean
  isLoggedIn: boolean
  isVerified: boolean
  isAGB: boolean
  userID?: string
  errors: [] | { field: AuthError | string; message: string }[]
}

type AuthAction = {
  payload: {
    verified?: boolean
    isAGB?: boolean
    userID?: string
    errors?: { field: AuthError | string; message: string }[]
  }
}

const initialState: AuthState = {
  isLoading: false,
  isLoggedIn: false,
  isVerified: false,
  isAGB: false,
  errors: []
}

//#region ThunkResolver
const startEmailRegister = createAsyncThunk(
  'auth/startEmailRegister',
  async (variables: RegisterMutationVariables, thunkAPI) => {
    try {
      const response = await apolloClient.mutate<
        RegisterMutation,
        RegisterMutationVariables
      >({
        mutation: RegisterDocument,
        variables
      })

      // console.log('response', response)

      const res = response.data?.auth_register

      if (res?.authToken && res?.user) {
        thunkAPI.dispatch(
          initUser({ ...res.user, email: variables.email } as UserState)
        )

        await SecureStore.setItemAsync('authToken', res.authToken.toString())

        return {
          userID: res.user._id,
          verified: res.user.verified
        }
      } else if (res?.errors) {
        if (res.errors.some((e) => e.field === 'email_taken')) {
          return thunkAPI.rejectWithValue({
            errors: [
              {
                field: AuthError.REGISTER_EMAIL_TAKEN,
                message: 'Registration resolver failed.'
              }
            ]
          })
        } else {
          throw new Error('Registration failed' + res.errors)
        }
      }
    } catch (e) {
      log.error('auth/startEmailRegister', e)

      return thunkAPI.rejectWithValue({
        errors: [
          {
            field: AuthError.REGISTER,
            message: 'Registration resolver failed.'
          }
        ]
      })
    }
  }
)

const startEmailLogin = createAsyncThunk(
  'auth/startEmailLogin',
  async (variables: LoginEmailMutationVariables, thunkAPI) => {
    try {
      const response = await apolloClient.mutate<
        LoginEmailMutation,
        LoginEmailMutationVariables
      >({
        mutation: LoginEmailDocument,
        variables
      })

      // console.log('response', response)

      const res = response.data?.auth_loginEmail

      if (res?.authToken && res?.user) {
        thunkAPI.dispatch(
          initUser({ ...res.user, email: variables.email } as UserState)
        )

        await SecureStore.setItemAsync('authToken', res.authToken.toString())

        return {
          userID: res.user._id,
          verified: res.user.verified
        }
      } else if (res?.errors) {
        throw new Error('Email login failed' + res.errors)
      }
    } catch (e) {
      log.error('auth/startEmailLogin', e)

      return thunkAPI.rejectWithValue({
        errors: [
          {
            field: AuthError.LOGIN_EMAIL,
            message: 'Email Login resolver failed.'
          }
        ]
      })
    }
  }
)

const startFacebookLogin = createAsyncThunk(
  'auth/startFacebookLogin',
  async (code: string, thunkAPI) => {
    try {
      const response = await apolloClient.mutate<
        LoginFacebookMutation,
        LoginFacebookMutationVariables
      >({
        mutation: LoginFacebookDocument,
        variables: {
          code
        }
      })

      const res = response.data?.auth_loginFacebook

      if (res?.authToken && res?.user) {
        thunkAPI.dispatch(initUser(res.user as UserState))

        await SecureStore.setItemAsync('authToken', res.authToken.toString())

        return {
          userID: res.user._id,
          verified: res.user.verified
        }
      } else if (res?.errors) {
        throw new Error('Facebook login failed' + res.errors)
      }
    } catch (e) {
      log.error('auth/startFacebookLogin', e)

      return thunkAPI.rejectWithValue({
        errors: [
          {
            field: AuthError.LOGIN_FACEBOOK,
            message: 'Facebook Login resolver failed.'
          }
        ]
      })
    }
  }
)

const startGoogleLogin = createAsyncThunk(
  'auth/startGoogleLogin',
  async (token: string, thunkAPI) => {
    try {
      const response = await apolloClient.mutate<
        LoginGoogleMutation,
        LoginGoogleMutationVariables
      >({
        mutation: LoginGoogleDocument,
        variables: {
          token
        }
      })

      const res = response.data?.auth_loginGoogle

      console.log('response GOOGLE DATA', response.data)

      if (res?.authToken && res?.user) {
        thunkAPI.dispatch(startInitUser(res.user as UserState))

        await SecureStore.setItemAsync('authToken', res.authToken.toString())

        return {
          userID: res.user._id,
          verified: res.user.verified
        }
      } else if (res?.errors) {
        throw new Error('Google login failed' + res.errors)
      }
    } catch (e) {
      log.error('auth/startGoogleLogin', e)

      return thunkAPI.rejectWithValue({
        errors: [
          {
            field: AuthError.LOGIN_GOOGLE,
            message: 'Google Login resolver failed.'
          }
        ]
      })
    }
  }
)

const startLogout = createAsyncThunk(
  'auth/startLogout',
  async (_, thunkAPI) => {
    try {
      const authToken = await SecureStore.getItemAsync('authToken')

      if (authToken) {
        apolloClient.mutate<LogoutAllMutation>({
          mutation: LogoutAllDocument
        })

        await SecureStore.deleteItemAsync('authToken')

        thunkAPI.dispatch(resetUser())
      }
    } catch (e) {
      log.error('auth/startLogout', e)
    }
  }
)

const startInitAuth = createAsyncThunk(
  'auth/startInitAuth',
  async (_, thunkAPI) => {
    try {
      const response = await apolloClient.query<MeQuery>({
        query: MeDocument
      })

      let res = response.data.user_me

      thunkAPI.dispatch(
        startInitUser({ ...res, userID: res?._id } as UserState)
      )

      return response.data.user_me
    } catch (e: any) {
      log.error('auth/startInitAuth', e)

      try {
        let errors = []

        if (e.message.includes('404')) {
          errors.push({
            field: AuthError.NOT_FOUND,
            message: 'No connection'
          })
        } else {
          errors.push({
            field: AuthError.NOT_AUTHENTICATED,
            message: 'Not authorized'
          })
        }

        await SecureStore.deleteItemAsync('authToken')

        return thunkAPI.rejectWithValue({
          errors
        })
      } catch (e) {
        log.error('auth/startInitAuth', e)
      }
    }
  }
)

const startConfirmedEmail = createAsyncThunk(
  'auth/startConfirmedEmail',
  async (_, thunkAPI) => {
    try {
      apolloClient.cache.evict({ fieldName: 'me' })

      const response = await apolloClient.query<MeQuery>({
        query: MeDocument
      })

      let res = response.data.user_me

      if (res?.verified) {
        thunkAPI.dispatch(initUser({ ...res, userID: res._id } as UserState))

        return { verified: true }
      } else {
        await apolloClient.mutate<
          RequestConfirmationEmailMutation,
          RequestConfirmationEmailMutationVariables
        >({
          mutation: RequestConfirmationEmailDocument,
          variables: {
            email: res?.email!
          }
        })

        throw new Error()
      }
    } catch (e: any) {
      log.error('auth/startConfirmedEmail', e)

      try {
        let errors = []
        console.log('error', e)

        if (e.message.includes('404')) {
          errors.push({
            field: AuthError.NOT_FOUND,
            message: 'No connection'
          })
        } else {
          await SecureStore.deleteItemAsync('authToken')

          errors.push({
            field: AuthError.NOT_AUTHENTICATED,
            message: 'Not authorized'
          })
        }

        return thunkAPI.rejectWithValue({
          errors
        })
      } catch (e) {
        log.error('auth/startConfirmedEmail', e)
      }
    }
  }
)
//#endregion

//#region Resolver
const loadingHandler: CaseReducer<AuthState> = (state, _) => {
  state.isLoading = true
}

const confirmAGBHandler: CaseReducer<AuthState> = (state, _) => {
  state.isAGB = true
}

const stopLoadingHandler: CaseReducer<AuthState> = (state, _) => {
  state.isLoading = false
}

const clearErrorHandler: CaseReducer<AuthState> = (state, _) => {
  state.errors = []
}

const networkErrorHandler: CaseReducer<AuthState> = (state, _) => {
  state.errors = [
    {
      field: AuthError.NOT_FOUND,
      message: 'No internet connection'
    }
  ]
}
//#endregion

//#region Universal
const resolve = (state: AuthState, action: AuthAction) => {
  const { userID, verified } = action.payload

  state.errors = []
  state.isLoading = false
  state.isLoggedIn = true
  state.isVerified = verified!
  state.userID = userID
}

const pending = (state: AuthState, action: AuthAction) => {
  state.isLoading = true
}

const reject = (state: AuthState, action: AuthAction) => {
  const { errors } = action.payload
  state.errors = errors ? errors : []
  state.isLoading = false
  state.isLoggedIn = false
  state.isVerified = false
}
//#endregion

//#region InitUser
const resolveInitUser = (state: AuthState, action: AuthAction) => {
  const { userID, verified } = action.payload
  state.userID = userID
  state.isLoading = false
  state.isLoggedIn = true
  state.isVerified = verified!
  state.errors = []
}

const rejectInitUser = (state: AuthState, action: AuthAction) => {
  const { errors } = action.payload
  state.isLoggedIn = false
  state.isLoading = false
  state.errors = errors ? errors : []
}

//#endregion

//#region ConfirmedEmail
const resolveConfirmedEmail = (state: AuthState, action: AuthAction) => {
  state.isLoading = false
  state.isVerified = true
  state.errors = []
}

const rejectConfirmedEmail = (state: AuthState, action: AuthAction) => {
  const { errors } = action.payload
  state.isLoading = false
  state.errors = errors ? errors : []
}
//#endregion

//#region Logout
const resolveLogout = (state: AuthState, action: AuthAction) => {
  state.userID = undefined
  state.isLoading = false
  state.errors = []
  state.isLoggedIn = false
  state.isVerified = false
}

const pendingLogout = (state: AuthState, action: AuthAction) => {
  state.isLoading = true
  state.isVerified = false
}

const rejectLogout = (state: AuthState, action: AuthAction) => {
  state.isLoggedIn = false
  state.isLoading = false
  state.isVerified = false
}
//#endregion

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loading: loadingHandler,
    stopLoading: stopLoadingHandler,
    networkError: networkErrorHandler,
    confirmAGB: confirmAGBHandler,
    clearError: clearErrorHandler
  },
  extraReducers: {
    //* Facebook
    [startFacebookLogin.fulfilled.type]: resolve,
    [startFacebookLogin.pending.type]: pending,
    [startFacebookLogin.rejected.type]: reject,

    //* Google
    [startGoogleLogin.fulfilled.type]: resolve,
    [startGoogleLogin.pending.type]: pending,
    [startGoogleLogin.rejected.type]: reject,

    //* Email
    [startEmailLogin.fulfilled.type]: resolve,
    [startEmailLogin.pending.type]: pending,
    [startEmailLogin.rejected.type]: reject,

    [startEmailRegister.fulfilled.type]: resolve,
    [startEmailRegister.rejected.type]: reject,

    //* InitUser
    [startInitAuth.fulfilled.type]: resolveInitUser,
    [startInitAuth.pending.type]: pending,
    [startInitAuth.rejected.type]: rejectInitUser,

    //* ConfirmedEmail
    [startConfirmedEmail.fulfilled.type]: resolveConfirmedEmail,
    [startConfirmedEmail.rejected.type]: rejectConfirmedEmail,

    //* Logout
    [startLogout.fulfilled.type]: resolveLogout,
    [startLogout.pending.type]: pendingLogout,
    [startLogout.rejected.type]: rejectLogout
  }
})

const { loading, stopLoading, networkError, confirmAGB, clearError } =
  authSlice.actions
const authSelector = (state: RootState) => state.auth

export {
  authSelector,
  clearError,
  confirmAGB,
  loading,
  networkError,
  startConfirmedEmail,
  startEmailLogin,
  startEmailRegister,
  startFacebookLogin,
  startGoogleLogin,
  startInitAuth,
  startLogout,
  stopLoading
}

export default authSlice.reducer
