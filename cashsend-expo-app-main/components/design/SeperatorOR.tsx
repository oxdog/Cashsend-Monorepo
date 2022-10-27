import React from 'react'
import { Text, View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'

interface SeperatorORProps {}

export const SeperatorOR: React.FC<SeperatorORProps> = ({}) => {
  return (
    <View style={tailwind('flex flex-row items-center w-4/5 mb-1')}>
      <View style={tailwind('flex-1 h-px bg-gray-300')} />
      <View>
        <Text thin style={tailwind('w-16 text-center')}>oder</Text>
      </View>
      <View style={tailwind('flex-1 h-px bg-gray-300')} />
    </View>
  )
}
