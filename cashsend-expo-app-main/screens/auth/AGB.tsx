import * as SecureStore from 'expo-secure-store'
import React from 'react'
import { Linking } from 'react-native'
import { Button, Text, View } from 'react-native-ui-lib'
import { useDispatch } from 'react-redux'
import tailwind from 'tailwind-rn'
import { Logo } from '@components/design/Logo'
import { SmoothBackground } from '@components/design/SmoothBackground'
import { confirmAGB } from '@redux/slices/authSlice'

export default function AGB() {
  const dispatch = useDispatch()

  const handleConfirm = async () => {
    await SecureStore.setItemAsync('AGB_VERSION', '1.0')
    dispatch(confirmAGB())
  }

  return (
    <View style={tailwind('relative w-full h-full bg-white')}>
      <View
        style={tailwind(
          'w-full h-full flex flex-col items-center justify-center p-4'
        )}
      >
        <Logo />

        <View style={tailwind('w-full px-4 mt-24 mb-8')}>
          <View
            style={tailwind('flex flex-row items-center justify-start w-full')}
          >
            <Text marginL-4 grey40>
              Durch Fortfahren erkläre Ich mich mit den{' '}
              <Text
                thin
                jungleGreen
                style={tailwind('underline')}
                onPress={() => Linking.openURL(process.env.AGB_LINK!)}
              >
                AGB
              </Text>{' '}
              und der{' '}
              <Text
                thin
                jungleGreen
                style={tailwind('underline')}
                onPress={() =>
                  Linking.openURL(process.env.PRIVACY_POLICY_LINK!)
                }
              >
                DSGVO
              </Text>{' '}
              von cashsend einverstanden.
            </Text>
          </View>
        </View>

        <Button enableShadow showLoader={true} onPress={handleConfirm}>
          <Text white semibold h1>
            Los geht's!
          </Text>
        </Button>
      </View>
      <SmoothBackground />
    </View>
  )
}
