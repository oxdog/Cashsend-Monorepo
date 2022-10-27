import { AuthFooter } from '@components/auth/AuthFooter'
import { EmailPasswordInput } from '@components/auth/EmailPasswordInput'
import { GoogleButton } from '@components/auth/GoogleButton'
import { Logo } from '@components/design/Logo'
import { SeperatorOR } from '@components/design/SeperatorOR'
import { SmoothBackground } from '@components/design/SmoothBackground'
import { ConnectionErrorToast } from '@components/toast/ConnectionErrorToast'
import { useGoogleLogin } from '@hooks/useGoogleLogin'
import { useNavigation } from '@react-navigation/core'
import {
  AuthError,
  authSelector,
  clearError,
  startEmailLogin,
  startGoogleLogin
} from '@redux/slices/authSlice'
import { useAppSelector } from '@redux/typedHooks'
import { log } from '@utils/logger'
import * as WebBrowser from 'expo-web-browser'
import React, { useState, useEffect } from 'react'
import { Button, Colors, Text, View } from 'react-native-ui-lib'
import { useDispatch } from 'react-redux'
import tailwind from 'tailwind-rn'
import validator from 'validator'

WebBrowser.maybeCompleteAuthSession()

export default function SignIn() {
  const { errors } = useAppSelector(authSelector)
  const navigation = useNavigation()

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [password, setPassword] = useState('')

  const [showConnectionError, setShowConnectionError] = useState<boolean>(false)

  const dispatch = useDispatch()

  // const [requestFacebook, responseFacebook, promptFacebook] = useFacebookLogin()
  const [requestGoogle, responseGoogle, promptGoogle] = useGoogleLogin()

  useEffect(() => {
    if (errors.length >= 1) {
      setShowConnectionError(true)
    }
  }, [errors])

  useEffect(() => {
    const isLoginGoogleError = errors.some(
      (e) => e.field === AuthError.LOGIN_GOOGLE
    )
    const isLoginFacebookError = errors.some(
      (e) => e.field === AuthError.LOGIN_FACEBOOK
    )
    const isLoginEmailError = errors.some(
      (e) => e.field === AuthError.LOGIN_EMAIL
    )

    setShowConnectionError(
      isLoginGoogleError || isLoginFacebookError || isLoginEmailError
    )
  }, [errors])

  useEffect(() => {
    if (responseGoogle?.type) {
      if (responseGoogle.type === 'success') {
        const { access_token } = responseGoogle.params

        dispatch(startGoogleLogin(access_token))
      } else {
        setShowConnectionError(true)
      }
    }
  }, [responseGoogle])

  // React.useEffect(() => {
  //   if (responseFacebook?.type) {
  //     if (responseFacebook.type === 'success') {
  //       const { code } = responseFacebook.params
  //       dispatch(startFacebookLogin(code))
  //     } else {
  //       setShowGenericError(true)
  //     }
  //   }
  // }, [responseFacebook])

  // const handleFacebookLogin = () => promptFacebook()
  const handleGoogleLogin = () => {
    try {
      promptGoogle({ toolbarColor: '#32a37f' })
    } catch (e) {
      log.error('SignIn/handleGoogleLogin', e)
    }
  }

  const handleEmailLogin = () => {
    const isValidEmail = validator.isEmail(email)
    if (isValidEmail) {
      setEmailError('')
      dispatch(startEmailLogin({ email, password }))
    } else {
      setEmailError('Sieht nicht wie eine Email aus.')
    }
  }

  return (
    <View
      style={tailwind(
        'relative flex flex-col items-center justify-between w-full h-full bg-white'
      )}
    >
      <View style={tailwind('pt-12')}>
        <Logo />
      </View>

      {/* LoginForm */}
      <View style={tailwind('flex flex-col items-center w-full mb-12')}>
        <View style={tailwind('w-4/5')}>
          <EmailPasswordInput
            emailError={emailError}
            setEmail={setEmail}
            setEmailError={setEmailError}
            setPassword={setPassword}
          />

          <Text
            style={tailwind('flex flex-row self-end mt-3 underline mb-4')}
            thin
            marginL-8
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            Passwort vergessen
          </Text>

          <Button
            label="Einloggen"
            labelStyle={{ fontWeight: '600', textAlign: 'center' }}
            backgroundColor={Colors.jungleGreen}
            enableShadow
            marginB-s2
            onPress={() => {
              handleEmailLogin()
            }}
          />
        </View>

        <View marginV-8>
          <SeperatorOR />
        </View>

        {/* auth login button */}
        <View style={tailwind('w-4/5 flex flex-col items-center mb-4')}>
          {/* <FacebookButton
            outline={false}
            handleFacebookLogin={handleFacebookLogin}
          /> */}
          <GoogleButton outline={false} handleGoogleLogin={handleGoogleLogin} />
        </View>
      </View>

      <AuthFooter
        cta="Registrieren"
        message="Noch keinen Account?"
        navigateTo="SignUpMain"
      />

      <ConnectionErrorToast
        isVisible={showConnectionError}
        setVisible={setShowConnectionError}
      />

      <SmoothBackground />
    </View>
  )
}
