import { Background } from '@components/design/Background'
import { HomeScreenNavBar } from '@components/HomeScreenNavBar'
import { ConnectionErrorToast } from '@components/toast/ConnectionErrorToast'
import { GenericErrorToast } from '@components/toast/GenericErrorToast'
import { InfoToast } from '@components/toast/InfoToast'
import { SignedOutErrorToast } from '@components/toast/SignedOutErrorToast'
import { SuccessToast } from '@components/toast/SuccessToast'
import { FontAwesome } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { elevationShadowStyle } from '@utils/elevationShadowStyle'
import React from 'react'
import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'

export default function HomeScreen() {
  const navigation = useNavigation()

  return (
    <View style={tailwind('relative h-full w-full')}>
      <Background />

      <HomeScreenNavBar />

      {/* Scann Button */}
      <View
        style={{
          zIndex: 0,
          ...tailwind('absolute inset-0 flex items-center justify-center')
        }}
        // onPress={() => navigation.navigate('PaymentScreen')}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('QRScanner')}
          style={{
            ...elevationShadowStyle(10),
            ...tailwind(
              'w-48 h-48 pt-4 rounded-lg bg-white flex items-center justify-center'
            )
          }}
        >
          <FontAwesome name="qrcode" size={220} color={Colors.newBlack} />
        </TouchableOpacity>
        <Text semibold marginT-8>
          Drücke hier um einen Code zu scannen
        </Text>
      </View>
    </View>
  )
}
