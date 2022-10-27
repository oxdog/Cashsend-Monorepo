import Decoration from '@assets/images/background/decoration.svg'
import Gradient from '@assets/images/background/gradient.svg'
import React from 'react'
import { View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'

interface BackgroundProps {}

export const Background: React.FC<BackgroundProps> = ({}) => {
  return (
    <View style={tailwind('absolute bg-yellow-400 inset-0')}>
      <View
        style={tailwind(
          'relative h-full w-full flex items-center justify-center'
        )}
      >
        <View
          style={{
            zIndex: -25,
            ...tailwind('absolute bottom-0 flex items-center justify-center')
          }}
        >
          <Decoration width={650} height={650} />
        </View>
        <View style={{ zIndex: -30 }}>
          <Gradient width={800} height={800} />
        </View>
      </View>
    </View>
  )
}
