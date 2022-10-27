import React, { useState } from 'react'
import { TextField, View, Text, Switch, Colors } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'
import validator from 'validator'
import { Feather } from '@expo/vector-icons'

interface EmailAndPasswordProps {
  emailError: string
  passwordError?: string
  setEmail: (value: React.SetStateAction<string>) => void
  setEmailError: (value: React.SetStateAction<string>) => void
  setPassword: (value: React.SetStateAction<string>) => void
  setPasswordError?: (value: React.SetStateAction<string>) => void
}

export const EmailPasswordInput: React.FC<EmailAndPasswordProps> = ({
  emailError,
  passwordError,
  setPassword,
  setEmail,
  setEmailError,
  setPasswordError
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleChangeEmail = (text: string) => {
    setEmail(text)
    setEmailError(validator.isEmail(text) ? '' : emailError)
  }

  const handlePasswordChange = (text: string) => {
    setPassword(text)
    setPasswordError && setPasswordError('')
  }

  return (
    <View>
      <TextField
        placeholder="Email"
        error={emailError}
        onChangeText={(text: string) => handleChangeEmail(text)}
      />

      <View style={tailwind('mt-6 relative')}>
        <TextField
          placeholder="Password"
          error={passwordError}
          secureTextEntry={!showPassword}
          onChangeText={(text: string) => handlePasswordChange(text)}
          style={tailwind('pr-8')}
        />
        <View
          style={tailwind(
            'absolute bottom-2 right-2 h-8 flex items-center justify-center p-1 bg-white rounded-full'
          )}
          onTouchEnd={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <Feather name="eye" size={24} color={Colors.newBlack} />
          ) : (
            <Feather name="eye-off" size={24} color={Colors.newBlack} />
          )}
        </View>
      </View>
    </View>
  )
}
