import { AuthFooter } from '@components/auth/AuthFooter'
import { GoogleButton } from '@components/auth/GoogleButton'
import { Logo } from '@components/design/Logo'
import { SeperatorOR } from '@components/design/SeperatorOR'
import { SmoothBackground } from '@components/design/SmoothBackground'
import { ConnectionErrorToast } from '@components/toast/ConnectionErrorToast'
import { SignedOutErrorToast } from '@components/toast/SignedOutErrorToast'
import { useGoogleLogin } from '@hooks/useGoogleLogin'
import { useNavigation } from '@react-navigation/core'
import {
  AuthError,
  authSelector,
  clearError,
  startGoogleLogin
} from '@redux/slices/authSlice'
import { useAppSelector } from '@redux/typedHooks'
import { log } from '@utils/logger'
import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native-ui-lib'
import { useDispatch } from 'react-redux'
import tailwind from 'tailwind-rn'

export default function SignUp() {
  const navigation = useNavigation()
  const { errors } = useAppSelector(authSelector)

  const dispatch = useDispatch()

  // const [requestFacebook, responseFacebook, promptFacebook] = useFacebookLogin()
  const [requestGoogle, responseGoogle, promptGoogle] = useGoogleLogin()

  const [showConnectionError, setShowConnectionError] = useState<boolean>(false)
  const [showLogoutError, setShowLogoutError] = useState<boolean>(false)

  useEffect(() => {
    const isLoginError = errors.some((e) => e.field === AuthError.LOGIN_GOOGLE)
    const isLogoutError = errors.some(
      (e) => e.field === AuthError.NOT_AUTHENTICATED
    )

    setShowLogoutError(isLogoutError)
    setShowConnectionError(isLoginError)
  }, [errors])

  useEffect(() => {
    if (responseGoogle?.type) {
      if (responseGoogle.type === 'success') {
        const { access_token } = responseGoogle.params
        console.log('response google', responseGoogle.params)

        dispatch(startGoogleLogin(access_token))
      } else {
        setShowConnectionError(true)
      }
    }
  }, [responseGoogle, requestGoogle])

  // useEffect(() => {
  //   if (responseFacebook?.type) {
  //     if (responseFacebook.type === 'success') {
  //       const { code } = responseFacebook.params
  //       console.log('response facebook', responseFacebook.params)

  //       dispatch(startFacebookLogin(code))
  //     } else {
  //       setShowGenericError(true)
  //     }
  //   }
  // }, [responseFacebook])

  // const handleFacebookLogin = () => promptFacebook({ toolbarColor: '#32a37f' })
  const handleGoogleLogin = () => {
    try {
      promptGoogle({ toolbarColor: '#32a37f' })
    } catch (e) {
      log.error('SignUpMain/handleGoogleLogin', e)
    }
  }

  return (
    <View
      style={tailwind(
        'relative flex flex-col items-center justify-between w-full h-full bg-white'
      )}
    >
      <View marginT-56>
        <Logo />
      </View>

      <View
        style={tailwind(
          'flex flex-col items-center justify-center mb-24 w-full'
        )}
      >
        {/* auth login button */}
        <View style={tailwind('w-4/5 flex flex-col items-center')}>
          {/* <View marginB-8 width="100%">
            <FacebookButton handleFacebookLogin={handleFacebookLogin} />
          </View> */}
          <GoogleButton handleGoogleLogin={handleGoogleLogin} />
        </View>

        <View marginV-8>
          <SeperatorOR />
        </View>

        <Text
          jungleGreen
          semibold
          onPress={() => navigation.navigate('SignUpDetails')}
        >
          Mit Email einen Account erstellen
        </Text>
      </View>

      <AuthFooter
        cta="Einloggen"
        message="Bereits einen Account?"
        navigateTo="SignIn"
      />

      <ConnectionErrorToast
        isVisible={showConnectionError}
        setVisible={setShowConnectionError}
      />

      <SignedOutErrorToast
        isVisible={showLogoutError}
        setVisible={setShowLogoutError}
      />

      <SmoothBackground />
    </View>
  )
}
