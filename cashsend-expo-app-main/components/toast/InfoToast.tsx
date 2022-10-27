import { AntDesign, Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Colors, Text, Toast, View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'
import { MaterialCommunityIcons } from '@expo/vector-icons'
interface InfoToastProps {
  isVisible: boolean
  setVisible: (value: any) => void
  message: string
  note?: string
  position?: 'top' | 'bottom'
}

export const InfoToast: React.FC<InfoToastProps> = ({
  isVisible,
  setVisible,
  message,
  note,
  position = 'top'
}) => {
  return (
    <Toast
      visible={isVisible}
      position={position}
      backgroundColor={Colors.goldenTainoi}
      autoDismiss={3000}
      onDismiss={() => setVisible(false)}
    >
      <View
        style={{
          ...tailwind('flex flex-row items-center justify-between px-2 pb-2'),
          ...(position === 'top'
            ? tailwind('pb-4 pt-6')
            : tailwind('pb-6 pt-4'))
        }}
        onTouchEnd={() => setVisible(false)}
      >
        <View style={tailwind('flex flex-row items-center justify-start')}>
          <View paddingH-8>
            <MaterialCommunityIcons
              name="email-alert-outline"
              size={24}
              color="white"
            />
          </View>
          <View style={tailwind('flex flex-col pr-8')}>
            <Text white semibold>
              {message}
            </Text>

            {note && <Text white>{note}</Text>}
          </View>
        </View>

        <AntDesign
          name="close"
          size={24}
          color={Colors.white}
          style={tailwind('mr-4 opacity-50')}
        />
      </View>
    </Toast>
  )
}
