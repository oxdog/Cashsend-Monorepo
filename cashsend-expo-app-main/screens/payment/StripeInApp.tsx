import { useStripe } from '@stripe/stripe-react-native'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { Button } from 'react-native-ui-lib'
import PaymentScreen from '@components/PaymentScreenWrapper'
import { useCreatePaymentSheetMutation } from '@generated/graphql-react'

const API_URL = 'https://positive-alabaster-petunia.glitch.me'

export default function PaymentsUICompleteScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe()
  const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false)
  const [loading, setLoadng] = useState(false)
  const [clientSecret, setClientSecret] = useState<string>()

  const [createPaymentSheet] = useCreatePaymentSheetMutation()

  const fetchPaymentSheetParams = async () => {
    const { data } = await createPaymentSheet({
      variables: {
        amount: 2000,
        partnerID: '60e4a315ca5f0045f8d2edb9'
      }
    })

    console.log('sheet data', data)

    // TODO SOME ERROR CHECKING HERE
    const paymentIntent = data?.pay_createPaymentSheet.paymentIntent!
    const ephemeralKey = data?.pay_createPaymentSheet.ephemeralKey
    const customer = data?.pay_createPaymentSheet.customer

    setClientSecret(paymentIntent)

    return {
      paymentIntent,
      ephemeralKey,
      customer
    }
  }

  const openPaymentSheet = async () => {
    if (!clientSecret) {
      console.log('no secret')
      return
    }

    setLoadng(true)

    const { error } = await presentPaymentSheet({
      clientSecret
    })

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message)
    } else {
      Alert.alert('Success', 'The payment was confirmed successfully')
    }

    setPaymentSheetEnabled(false)
    setLoadng(false)
  }

  const initialisePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams()

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      customFlow: false,
      merchantDisplayName: 'cashsend',
      style: 'automatic'
    })

    if (!error) {
      setPaymentSheetEnabled(true)
    }
  }

  useEffect(() => {
    // In your app’s checkout, make a network request to the backend and initialize PaymentSheet.
    // To reduce loading time, make this request before the Checkout button is tapped, e.g. when the screen is loaded.
    initialisePaymentSheet()

    // eslint-disable-next-line react-@hooks/exhaustive-deps
  }, [])

  return (
    <PaymentScreen>
      <Button
        marginB-8
        loading={loading}
        disabled={!paymentSheetEnabled}
        label="Checkout"
        onPress={openPaymentSheet}
      />
    </PaymentScreen>
  )
}
