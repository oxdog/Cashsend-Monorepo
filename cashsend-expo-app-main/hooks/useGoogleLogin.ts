import * as Google from 'expo-auth-session/providers/google'

export const useGoogleLogin = () =>
  Google.useAuthRequest({
    expoClientId: process.env.WEB_OAUTH_CLIENT_ID_GOOGLE,
    androidClientId: process.env.ANDROID_OAUTH_CLIENT_ID_GOOGLE,
    iosClientId: process.env.IOS_OAUTH_CLIENT_ID_GOOGLE,
    scopes: ['email', 'profile']
  })
