import { AntDesign, FontAwesome5 } from '@expo/vector-icons'
import { clearError } from '@redux/slices/authSlice'
import React from 'react'
import { Colors, Text, Toast, View } from 'react-native-ui-lib'
import { useDispatch } from 'react-redux'
import tailwind from 'tailwind-rn'
interface ConnectionErrorToastProps {
  isVisible: boolean
  setVisible: (value: boolean) => void
  position?: 'top' | 'bottom'
}

export const GenericErrorToast: React.FC<ConnectionErrorToastProps> = ({
  isVisible,
  setVisible,
  position = 'top'
}) => {
  const dispatch = useDispatch()

  const handleConfirmError = () => {
    dispatch(clearError())
    setVisible(false)
  }

  return (
    <Toast
      visible={isVisible}
      position={position}
      backgroundColor={Colors.bittersweet}
      autoDismiss={3000}
      onDismiss={handleConfirmError}
    >
      <View
        style={{
          ...tailwind('flex flex-row items-center justify-between px-2 pb-2'),
          ...(position === 'top'
            ? tailwind('pb-4 pt-6')
            : tailwind('pb-6 pt-4'))
        }}
        onTouchEnd={handleConfirmError}
      >
        <View style={tailwind('flex flex-row items-center justify-start')}>
          <View paddingH-8>
            <FontAwesome5 name="times-circle" size={24} color="white" />
          </View>
          <View style={tailwind('flex flex-col')}>
            <Text white semibold>
              Sieht nach einem Fehler aus
            </Text>
            <Text white>Da ist wohl was schief gelaufen</Text>
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
