import { useNavigation } from '@react-navigation/core'
import { clearError } from '@redux/slices/authSlice'
import React from 'react'
import { Text, View } from 'react-native-ui-lib'
import { useDispatch } from 'react-redux'
import tailwind from 'tailwind-rn'

interface AuthFooterProps {
  message: string
  cta: string
  navigateTo: string
}

export const AuthFooter: React.FC<AuthFooterProps> = ({
  cta,
  message,
  navigateTo
}) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  return (
    <View
      style={tailwind(
        'absolute bottom-0 border-t border-gray-200 w-full flex flex-row h-10 items-center justify-center bg-white'
      )}
    >
      <Text thin> {message} </Text>
      <Text
        semibold
        marginL-4
        style={tailwind('text-sm ml-1')}
        onPress={() => navigation.navigate(navigateTo)}
      >
        {cta}
      </Text>
    </View>
  )
}
