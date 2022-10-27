import { FontAwesome } from '@expo/vector-icons'
import { AuthSessionResult } from 'expo-auth-session'
import React from 'react'
import { Button, Colors, Text } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'

interface FacebookButtonProps {
  outline?: boolean
  handleFacebookLogin: () => Promise<AuthSessionResult>
}

export const FacebookButton: React.FC<FacebookButtonProps> = ({
  outline = true,
  handleFacebookLogin
}) => {
  return (
    <Button
      backgroundColor="#fff"
      outlineColor={outline ? Colors.authBlue : undefined}
      style={tailwind('w-full bg-white')}
      onPress={handleFacebookLogin}
    >
      <FontAwesome name="facebook" size={24} color={Colors.authBlue} />
      <Text semibold marginL-12 authBlue>
        Mit Facebook fortfahren
      </Text>
    </Button>
  )
}
