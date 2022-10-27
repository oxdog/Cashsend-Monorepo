import React from 'react'
import { View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'
import BottomLeft from '@assets/svg/LoginDecoration/BottomLeft.svg'
import MiddleRight from '@assets/svg/LoginDecoration/MiddleRight.svg'
import TopLeft from '@assets/svg/LoginDecoration/TopLeft.svg'

interface SmoothBackgroundProps {}

export const SmoothBackground: React.FC<SmoothBackgroundProps> = ({}) => {
  return (
    <View
      style={{
        zIndex: -1,
        ...tailwind('absolute top-0 w-full h-full')
      }}
    >
      <View style={{ position: 'absolute', top: -85, left: -45 }}>
        <TopLeft width={230} height={230} />
      </View>
      <View style={{ position: 'absolute', top: 250, right: -230 }}>
        <MiddleRight width={400} height={400} />
      </View>
      <View style={{ position: 'absolute', bottom: -50, left: -60 }}>
        <BottomLeft width={230} height={230} />
      </View>
    </View>
  )
}
