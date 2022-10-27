import React from 'react'
import { ActivityIndicator } from 'react-native'
import { Colors, Text, View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'

interface SimpleLoadingMessageProps {}

export const SimpleLoadingMessage: React.FC<SimpleLoadingMessageProps> = () => (
  <View
    style={tailwind('w-full h-full bg-white flex items-center justify-center')}
  >
    <Text semibold shadowGreen style={tailwind('mt-4 mb-8')}>
      Einen Moment bitte ...
    </Text>
    <ActivityIndicator size="large" color={Colors.jungleGreen} />
  </View>
)
