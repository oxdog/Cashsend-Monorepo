import { MaterialIcons } from '@expo/vector-icons'
import { initStripe } from '@stripe/stripe-react-native'
import React, { useEffect, useState } from 'react'
import { Text } from 'react-native'
import { View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'
import { useStripePublicKeyQuery } from '@generated/graphql-react'
import { StripePublicKeyQuery } from '@generated/graphql-requests'
import { log } from '@utils/logger'

interface PaymentScreenWrapperProps {}

export const PaymentScreenWrapper: React.FC<PaymentScreenWrapperProps> = ({
  children
}) => {
  const [loading, setLoading] = useState(true)
  const { data } = useStripePublicKeyQuery()

  useEffect(() => {
    console.log('data', data)
    if (!data) return

    async function initialize(data: StripePublicKeyQuery | undefined) {
      try {
        const publishableKey = data?.pay_stripePublicKey

        if (publishableKey) {
          await initStripe({
            publishableKey,
            merchantIdentifier: process.env.STRIPE_MERCHANT_IDENTIFIER,
            urlScheme: process.env.STRIPE_URL_SCHEME,
            setUrlSchemeOnAndroid: true
          })
        }
      } catch (e) {
        log.error('Initialize stripe', e)
      } finally {
        setLoading(false)
      }
    }

    initialize(data)
    // eslint-disable-next-line react-@hooks/exhaustive-deps
  }, [data])

  const renderLoadingPage = () => (
    <View
      style={tailwind('w-full h-full flex items-center justify-center px-4')}
      key="loadingIndicator"
    >
      <View
        style={{
          borderColor: '#0074D4',
          ...tailwind(
            'relative w-20 h-20 border-2 flex items-center justify-center rounded-full mb-8'
          )
        }}
      >
        <MaterialIcons
          name="lock"
          size={30}
          style={tailwind('text-gray-500')}
        />
      </View>

      <View style={tailwind('flex flex-col items-center')}>
        <Text
          style={tailwind('text-gray-500 text-xl font-semibold text-center')}
        >
          Verbindungsaufbau
        </Text>
        <Text
          style={tailwind('text-gray-300 font-semibold text-center mt-5 mx-4')}
        ></Text>
      </View>
    </View>
  )

  return loading ? (
    // <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
    [renderLoadingPage()]
  ) : (
    <View
      accessibilityLabel="payment-screen"
      style={tailwind(
        'flex-1 h-full w-full bg-white items-center justify-center'
      )}
    >
      {children}
      {/* eslint-disable-next-line react-native/no-inline-styles */}
      <Text style={{ opacity: 0 }}>appium fix</Text>
    </View>
  )
}
