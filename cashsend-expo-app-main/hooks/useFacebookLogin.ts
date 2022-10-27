import * as Facebook from 'expo-auth-session/providers/facebook'
import { ResponseType } from 'expo-auth-session'

export const useFacebookLogin = () =>
  Facebook.useAuthRequest({
    clientId: process.env.FACEBOOK_CLIENT_ID,
    androidClientId: process.env.FACEBOOK_CLIENT_ID,
    responseType: ResponseType.Code,
    scopes: ['email', 'public_profile']
  })
