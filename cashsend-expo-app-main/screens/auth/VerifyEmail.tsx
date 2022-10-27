import DarkLogo from '@assets/svg/LogoDark.svg'
import { SmoothBackground } from '@components/design/SmoothBackground'
import { ConnectionErrorToast } from '@components/toast/ConnectionErrorToast'
import { InfoToast } from '@components/toast/InfoToast'
import {
  AuthError,
  authSelector,
  startConfirmedEmail,
  startLogout
} from '@redux/slices/authSlice'
import { userSelector } from '@redux/slices/userSlice'
import { useAppSelector } from '@redux/typedHooks'
import React, { useEffect, useState } from 'react'
import { Button, Text, View } from 'react-native-ui-lib'
import { useDispatch } from 'react-redux'
import tailwind from 'tailwind-rn'

export default function VerifyEmail() {
  const { errors } = useAppSelector(authSelector)
  const { firstName, email } = useAppSelector(userSelector)

  const [showConnectionError, setShowConnectionError] = useState<boolean>(false)
  const [showResend, setShowResend] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const dispatch = useDispatch()

  useEffect(() => {
    const isResendError = errors.some((e) => e.field === 'resend')
    const isConnectionError = errors.some(
      (e) => e.field === AuthError.NOT_FOUND
    )

    setShowResend(isResendError)
    setShowConnectionError(isConnectionError)
    setIsLoading(false)
  }, [errors])

  const handleSendLink = async () => {
    dispatch(startConfirmedEmail())
    setIsLoading(true)
  }

  return (
    <View style={tailwind('relative flex-1 bg-white h-full w-full')}>
      <View
        style={tailwind(
          'flex flex-col items-center justify-around w-full h-full'
        )}
      >
        <View
          style={tailwind(
            'relative mt-8 w-40 h-40 flex items-center justify-center rounded-full'
          )}
        >
          <DarkLogo width={80} height={80} />
        </View>

        <View
          style={tailwind(
            'flex flex-col items-start justify-center w-full px-8'
          )}
        >
          <Text h1 marginB-16>
            Fast geschafft {firstName}
          </Text>

          <Text regular marginV-16>
            Bestätige noch deine Email um deinen Account nutzen zu können.
          </Text>

          <Text thin marginT-8>
            Wir haben dir den Link an{' '}
            <Text regular jungleGreen style={tailwind('flex-1')}>
              {email}
            </Text>{' '}
            gesendet.
          </Text>
        </View>

        {/* LoginForm */}
        <View style={tailwind('w-4/5 mt-8 self-center items-center')}>
          <Button
            enableShadow
            showLoader={true}
            onPress={() => {
              handleSendLink()
            }}
            style={{}}
          >
            {isLoading ? (
              <Text white semibold>
                Ladevorgang ...
              </Text>
            ) : (
              <Text white semibold>
                Weiter
              </Text>
            )}
          </Button>

          <Text thin marginT-8 onPress={() => dispatch(startLogout())}>
            zurück zum Login
          </Text>
        </View>
      </View>

      <InfoToast
        isVisible={showResend}
        setVisible={setShowResend}
        message="Scheint noch nicht bestätigt"
        note="Wir haben dir einen neuen Link gesendet."
      />

      <ConnectionErrorToast
        isVisible={showConnectionError}
        setVisible={setShowConnectionError}
      />

      <SmoothBackground />
    </View>
  )
}
