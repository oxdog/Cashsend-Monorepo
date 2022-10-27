import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { Toast, View, Text, Colors } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'
import { MaterialIcons } from '@expo/vector-icons'
import { clearError } from '@redux/slices/authSlice'
import { useDispatch } from 'react-redux'

interface SignedOutErrorToastProps {
  isVisible: boolean
  setVisible: (value: any) => void
  position?: 'top' | 'bottom'
}

export const SignedOutErrorToast: React.FC<SignedOutErrorToastProps> = ({
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
      position={'top'}
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
            <MaterialIcons name="logout" size={24} color="white" />
          </View>
          <View style={tailwind('flex flex-col')}>
            <Text white semibold>
              Automatischer Logout
            </Text>
            <Text white>Bitte melde dich erneut an</Text>
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
