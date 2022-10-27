import { AuthFooter } from '@components/auth/AuthFooter'
import { Logo } from '@components/design/Logo'
import { SmoothBackground } from '@components/design/SmoothBackground'
import { ConnectionErrorToast } from '@components/toast/ConnectionErrorToast'
import { SuccessToast } from '@components/toast/SuccessToast'
import { useRequestPasswordResetMutation } from '@generated/graphql-react'
import { AuthError, authSelector } from '@redux/slices/authSlice'
import { useAppSelector } from '@redux/typedHooks'
import { log } from '@utils/logger'
import React, { useEffect, useState } from 'react'
import { Button, Text, TextField, View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'
import validator from 'validator'

export default function ForgotPassword() {
  const { errors } = useAppSelector(authSelector)

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string>('')
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const [showConnectionError, setShowConnectionError] = useState<boolean>(false)

  const [requestReset, state] = useRequestPasswordResetMutation()

  useEffect(() => {
    const isConnectionError = errors.some(
      (e) => e.field === AuthError.NOT_FOUND
    )

    setShowConnectionError(isConnectionError)
  }, [errors])

  const handleChangeEmail = (text: string) => {
    setEmail(text)
    setEmailError(validator.isEmail(text) ? '' : emailError)
  }

  const handleSendLink = async () => {
    try {
      const isValidEmail = validator.isEmail(email)

      setEmailError(isValidEmail ? '' : 'Sieht nicht wie eine Email aus')

      if (isValidEmail) {
        await requestReset({
          variables: {
            email
          }
        })
      }

      setShowSuccess(true)
    } catch (e) {
      log.error('forgotPassword/handleSendLink', e)

      setShowConnectionError(true)
    }
  }

  return (
    <View style={tailwind('flex-1 bg-white w-full h-full')}>
      <View
        style={tailwind(
          'relative flex flex-col items-center justify-start w-full h-full px-4'
        )}
      >
        <Logo />

        {/* LoginForm */}
        <View style={tailwind('w-4/5 mt-12')}>
          <TextField
            placeholder="Email"
            error={emailError}
            onChangeText={(text: string) => handleChangeEmail(text)}
          />

          <Button
            enableShadow
            showLoader={true}
            marginT-16
            onPress={() => {
              handleSendLink()
            }}
          >
            {state.loading ? (
              <Text white> Ladevorgang ... </Text>
            ) : (
              <Text white> Link senden </Text>
            )}
          </Button>

          <Text thin style={tailwind('text-center mt-4')}>
            Wir senden dir einen Link per Email um dein Passwort neu
            festzulegen.
          </Text>
        </View>
      </View>
      <AuthFooter
        cta="Einloggen"
        message="Bereits einen Account?"
        navigateTo="SignIn"
      />

      <SuccessToast
        isVisible={showSuccess}
        setVisible={setShowSuccess}
        message="Erfolgreich gesendet!"
      />

      <ConnectionErrorToast
        isVisible={showConnectionError}
        setVisible={setShowConnectionError}
      />

      <SmoothBackground />
    </View>
  )
}
