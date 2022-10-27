import { FontAwesome, Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Button, Colors, Incubator, Text, View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'
import { useHeaderBackButton } from '@hooks/useHeaderBackButton'
import { elevationShadowStyle } from '@utils/elevationShadowStyle'

interface AmountScreenProps {
  route: { params: { partnerID: string } }
  navigation: any
}

export const AmountScreen: React.FC<AmountScreenProps> = ({
  navigation,
  route
}) => {
  useHeaderBackButton(navigation)

  let { partnerID } = route.params

  const [amount, setAmount] = useState<Number>(0)
  const [error, setError] = useState<boolean>(true)

  const onAmountChange = (amount: string) => {
    if (!amount || amount.match(/^\d{1,}([.\,]\d{0,2})?$/)) {
      const pAmount = Number(amount.replace(',', '.'))
      setAmount(pAmount)

      if (pAmount < 0.5 || pAmount > 200 || amount === '') {
        setError(true)
        setAmount(0)
        return false
      } else {
        setError(false)
        return true
      }
    } else {
      setError(true)
      return false
    }
  }

  const handleGotoPayment = () => {
    navigation.navigate('PaymentScreen', {
      amount,
      partnerID
    })
  }

  return (
    <View style={tailwind('flex-1 items-center bg-white')}>
      <View style={tailwind('flex-grow flex-col justify-end items-center')}>
        <Text
          color={Colors.jungleGreen}
          style={tailwind('w-full text-center text-lg font-bold mb-8')}
        >
          Betrag eingeben
        </Text>

        <Incubator.TextField
          style={tailwind('text-4xl')}
          key="centered"
          placeholder="0,50"
          placeholderTextColor={Colors.grey50}
          labelColor={Colors.jungleGreen}
          validate={(text: string) => onAmountChange(text)}
          validateOnChange
          validationMessage="0,50€ bis 200,00€"
          color={Colors.jungleGreen}
          editable={true}
          centered={true}
          multiline={false}
          maxLength={6}
          useTopErrors={true}
          keyboardType="number-pad"
          trailingAccessory={
            <FontAwesome
              name="euro"
              size={36}
              color={Colors.jungleGreen}
              style={{}}
            />
          }
          containerStyle={{ marginBottom: 50, width: 125 }}
        />
      </View>

      <View style={tailwind('flex flex-col justify-center h-1/3')}>
        {!error && (
          <View style={tailwind('relative flex justify-center')}>
            <Button
              style={{
                backgroundColor: Colors.jungleGreen,
                ...tailwind(
                  'relative flex items-center justify-center p-0 pl-1'
                ),
                ...elevationShadowStyle(10)
              }}
              onPress={handleGotoPayment}
            >
              <Ionicons
                name="ios-checkmark-done-circle-outline"
                // style={{backgroundColor: Colors.jungleGreen, ...tailwind('rounded-full')}}
                size={72}
                color="white"
              />
            </Button>

            <Text
              color={Colors.grey50}
              style={tailwind(
                'absolute -bottom-20 w-full text-center text-lg font-bold mb-8'
              )}
            >
              Bezahlen
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default AmountScreen
