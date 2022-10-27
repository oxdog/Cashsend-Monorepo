import { AuthFooter } from '@components/auth/AuthFooter'
import { EmailPasswordInput } from '@components/auth/EmailPasswordInput'
import { Logo } from '@components/design/Logo'
import { SmoothBackground } from '@components/design/SmoothBackground'
import { ConnectionErrorToast } from '@components/toast/ConnectionErrorToast'
import { AntDesign } from '@expo/vector-icons'
import {
  AuthError,
  authSelector,
  startEmailRegister
} from '@redux/slices/authSlice'
import { useAppSelector } from '@redux/typedHooks'
import { validatePassword } from '@utils/validatePassword'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Colors,
  Text,
  TextField,
  Toast,
  View
} from 'react-native-ui-lib'
import { useDispatch } from 'react-redux'
import tailwind from 'tailwind-rn'
import validator from 'validator'

export default function SignUp() {
  const { errors } = useAppSelector(authSelector)

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string>('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string>('')
  const [firstName, setFirstName] = useState('')
  const [firstNameError, setFirstNameError] = useState<string>('')

  const [showPWErrorToast, setPWErrorToast] = useState<boolean>(false)
  const [showConnectionError, setShowConnectionError] = useState<boolean>(false)
  const [registerLoading, setRegisterLoading] = useState<boolean>(false)

  useEffect(() => {
    const isLoginError = errors.some((e) => e.field === AuthError.REGISTER)
    const isEmailError = errors.some(
      (e) => e.field === AuthError.REGISTER_EMAIL_TAKEN
    )

    setShowConnectionError(isLoginError)
    setEmailError(isEmailError ? 'Email bereits in Verwendung' : '')
    setRegisterLoading(false)
  }, [errors])

  const dispatch = useDispatch()

  const handleSignUp = () => {
    const isValidEmail = validator.isEmail(email)
    const isValidPassword = validatePassword(password)
    const isValidFirstName = firstName.length >= 3

    setEmailError(isValidEmail ? '' : 'Sieht nicht wie eine Email aus')

    setPasswordError(isValidPassword ? '' : 'Zu unsicheres Passwort')
    setPWErrorToast(!isValidPassword)

    setFirstNameError(isValidFirstName ? '' : 'Vorname zu kurz')

    if (isValidEmail && isValidPassword && isValidFirstName) {
      setRegisterLoading(true)
      dispatch(startEmailRegister({ email, password, firstName }))
    }
  }

  const handleFirstNameChange = (text: string) => {
    setFirstName(text)
    setFirstNameError(firstName.length > 3 ? '' : firstNameError)
  }

  return (
    <View style={tailwind('relative flex-1 bg-white h-full w-full')}>
      <View
        style={tailwind(
          'flex flex-col items-center justify-start w-full h-full'
        )}
      >
        <Logo />

        {/* LoginForm */}
        <View style={tailwind('flex flex-grow flex-col w-4/5 mt-8')}>
          <View style={tailwind('mb-6')}>
            <TextField
              placeholder="Vorname"
              error={firstNameError}
              onChangeText={(text: string) => handleFirstNameChange(text)}
            />
          </View>

          <EmailPasswordInput
            emailError={emailError}
            passwordError={passwordError}
            setEmail={setEmail}
            setEmailError={setEmailError}
            setPasswordError={setPasswordError}
            setPassword={setPassword}
          />

          <Button
            backgroundColor={Colors.jungleGreen}
            enableShadow
            style={tailwind('mt-8')}
            showLoader={true}
            onPress={() => {
              handleSignUp()
            }}
          >
            {registerLoading ? (
              <Text white> Ladevorgang ... </Text>
            ) : (
              <Text white> Registrieren </Text>
            )}
          </Button>
        </View>
        <AuthFooter
          cta="Einloggen"
          message="Bereits einen Account?"
          navigateTo="SignIn"
        />
      </View>

      <Toast
        visible={showPWErrorToast}
        position={'bottom'}
        backgroundColor={Colors.goldenTainoi}
        onDismiss={() => setPWErrorToast(false)}
        autoDismiss={3000}
      >
        <View style={tailwind('flex flex-row justify-between p-2')}>
          <View style={tailwind('flex flex-col')}>
            <Text semmibold white>
              Passwort Voraussetzung
            </Text>
            <Text white>
              {'- Mindestens 6 Zeichen \n- Mindestens eine Zahl'}
            </Text>
          </View>

          <View
            style={tailwind('h-full flex justify-center mr-4')}
            onTouchEnd={() => setPWErrorToast(false)}
          >
            <AntDesign name="close" size={24} color="white" />
          </View>
        </View>
      </Toast>

      <ConnectionErrorToast
        isVisible={showConnectionError}
        setVisible={setShowConnectionError}
      />

      <SmoothBackground />
    </View>
  )
}
