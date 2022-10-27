import React from 'react'
import { Text, View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'
import LogoDark from '@assets/svg/LogoDark.svg'

interface LogoProps {}

export const Logo: React.FC<LogoProps> = ({}) => {
  return (
    <View style={tailwind('flex flex-col items-center mt-16')}>
      <LogoDark width={100} height={100} />

      <Text marginT-8 logotextLarge>
        cashsend
      </Text>
    </View>
  )
}
