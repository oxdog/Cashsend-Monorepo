import React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { Colors, Text, View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'
import Logo from '@assets/svg/LogoDark.svg'

export default function LoadingScreen() {
  return (
    <View
      style={tailwind(
        'w-full h-full flex items-center justify-center bg-white'
      )}
    >
      <Logo width={100} height={100} />
      <ActivityIndicator marginT-8 size="large" color={Colors.newBlack} />
    </View>
  )
}
