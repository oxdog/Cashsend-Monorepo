import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useCreateCheckoutMutation } from '@generated/graphql-react'
import { useNavigation } from '@react-navigation/native'
import { log } from '@utils/logger'
import Constants from 'expo-constants'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import React, { useEffect, useState } from 'react'
import { Button, Colors, Text, View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'

interface PaymentScreenProps {
  route: { params: { amount: number; partnerID: string } }
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ route }) => {
  const [status, setStatus] = useState<string>()
  const [amount, setAmount] = useState<string>()
  const [receiver, setReceiver] = useState<string>()

  const navigation = useNavigation()

  const [createCheckout] = useCreateCheckoutMutation()

  const addLinkingListener = () =>
    Linking.addEventListener('url', handleRedirect)

  const removeLinkingListener = () =>
    Linking.removeEventListener('url', handleRedirect)

  const handleRedirect = (event: any) => {
    if (Constants.platform?.ios) {
      WebBrowser.dismissBrowser()
    } else {
      removeLinkingListener()
    }

    let data = Linking.parse(event.url)

    setStatus(data?.queryParams?.status)
    setAmount((Number(data?.queryParams?.amount) / 100).toFixed(2))
    setReceiver(data?.queryParams?.receiver)
  }

  useEffect(() => {
    let { amount, partnerID } = route.params
    amount = amount * 100

    const successLink = Linking.createURL('payment/success', {
      queryParams: {
        status: 'success',
        amount: amount.toString()
      }
    })

    const cancelLink = Linking.createURL('payment/cancel', {
      queryParams: { status: 'cancel' }
    })

    console.log('successLink', successLink)

    const apiCall = async (amount: number) => {
      try {
        const response = await createCheckout({
          variables: {
            amount,
            partnerID,
            redirect: {
              successLink,
              cancelLink
            }
          }
        })

        const checkoutSessionID =
          response.data?.pay_createCheckout.checkoutSessionID

        console.log('checkoutSessionID', checkoutSessionID)

        const uri = `${process.env.WEB_ENDPOINT}/stripe-checkout/${checkoutSessionID}`

        addLinkingListener()

        await WebBrowser.openBrowserAsync(uri, {
          enableDefaultShareMenuItem: false,
          showTitle: true,
          windowName: 'cashsend Online Zahlung'
        })

        if (Constants.platform?.ios) {
          removeLinkingListener()
        }
      } catch (error) {
        log.error('PaymentScreenWithWeb/apiCall', error)
      }
    }

    apiCall(amount)
  }, [])

  const renderLoadingPage = () => (
    <>
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
          style={tailwind(
            'text-gray-500 text-xl font-semibold w-full text-center'
          )}
        >
          Verbindungsaufbau
        </Text>
        <Text
          style={tailwind(
            'text-gray-300 font-semibold w-full text-center mt-5'
          )}
        >
          Die Bezahlseite wird geladen
        </Text>
      </View>
    </>
  )

  const renderSuccessPage = () => (
    <>
      <View
        style={{
          borderColor: Colors.jungleGreen,
          ...tailwind(
            'relative w-20 h-20 border-2 flex items-center justify-center rounded-full mb-8'
          )
        }}
      >
        <FontAwesome5
          name="check-double"
          size={30}
          color={Colors.jungleGreen}
        />
      </View>

      <View style={tailwind('flex flex-col items-center w-full')}>
        <Text
          style={tailwind('text-gray-500 text-xl font-bold w-full text-center')}
        >
          Erfolgreiche Zahlung.
        </Text>

        <Text
          style={tailwind(
            'text-gray-500 mt-8 w-4/5 text-center font-semibold text-lg'
          )}
        >
          <Text color={Colors.jungleGreen}>{amount}€ </Text>
          erfolgreich an
          <Text color={Colors.jungleGreen}> {receiver} </Text>
          gezahlt!
        </Text>

        <Button
          marginB-8
          label="ok"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </>
  )

  const renderCancelPage = () => (
    <>
      <View
        style={{
          borderColor: Colors.goldenTainoi,
          ...tailwind(
            'relative w-20 h-20 border-2 flex items-center justify-center rounded-full mb-8'
          )
        }}
      >
        <Ionicons name="close-outline" size={36} color={Colors.goldenTainoi} />
      </View>

      <View style={tailwind('flex flex-col items-center')}>
        <Text
          style={tailwind('text-gray-500 text-xl font-bold w-full text-center')}
        >
          Zahlung abgebrochen
        </Text>
      </View>
    </>
  )

  return (
    <View
      style={tailwind(
        'bg-white flex flex-col w-full h-full items-center justify-center'
      )}
    >
      {status === 'success'
        ? renderSuccessPage()
        : status === 'cancel'
        ? renderCancelPage()
        : renderLoadingPage()}
    </View>
  )
}

export default PaymentScreen
