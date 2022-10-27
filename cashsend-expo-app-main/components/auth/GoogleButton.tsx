import { FontAwesome } from '@expo/vector-icons'
import { AuthSessionResult } from 'expo-auth-session'
import React from 'react'
import { Button, Colors, Text } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'

interface GoogleButtonProps {
  outline?: boolean
  handleGoogleLogin: () => Promise<AuthSessionResult>
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({
  outline = true,
  handleGoogleLogin
}) => {
  return (
    <Button
      backgroundColor="#fff"
      outlineColor={outline ? Colors.authBlue : undefined}
      style={tailwind('w-full bg-white')}
      onPress={handleGoogleLogin}
    >
      <FontAwesome name="google" size={24} color={Colors.authBlue} />
      <Text semibold marginL-12 authBlue>
        Mit Google fortfahren
      </Text>
    </Button>
  )
}
