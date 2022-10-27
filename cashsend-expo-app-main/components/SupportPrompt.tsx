import React from 'react'
import { Text, View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'

interface SupportPromptProps {}

export const SupportPrompt: React.FC<SupportPromptProps> = () => (
  <View>
    <Text thin style={tailwind('text-center w-full')}>
      Benötigst du Hilfe oder hast eine Frage?
    </Text>
    <Text thin style={tailwind('text-center w-full mt-2')}>
      Schreibe uns unter
    </Text>
    <Text selectable style={tailwind('text-center w-full mt-1')}>
      support@cashsend.com
    </Text>
    <Text thin style={tailwind('text-center w-full mt-1')}>
      Unser Team hilft dir gerne!
    </Text>
  </View>
)
