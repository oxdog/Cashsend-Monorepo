import GrasBackground from '@assets/svg/GrasBackground.svg'
import { FlowLayout } from '@components/FlowLayout'
import { FontAwesome } from '@expo/vector-icons'
import { useOffSessionPaymentMutation } from '@generated/graphql-react'
import { useNavigation } from '@react-navigation/native'
import { userSelector } from '@redux/slices/userSlice'
import { useAppSelector } from '@redux/typedHooks'
import { log } from '@utils/logger'
import { limitLength } from '@utils/string/limitLength'
import _ from 'lodash'
import LottieView from 'lottie-react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BackHandler } from 'react-native'
import { Button, Colors, Incubator, Text, View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'

interface PaymentScreenProps {
  route: { params: { partnerID: string; partnerName: string } }
}

export const PaymentScreen: React.FC<PaymentScreenProps> = ({ route }) => {
  const getHeader = () => (
    <View key="getHeader" style={tailwind('flex flex-col justify-center')}>
      <Text thin style={tailwind('text-center')}>
        Einkauf bei
      </Text>
      <Text style={tailwind('mt-1 text-center px-2 bg-white rounded-lg')}>
        {limitLength(partnerName, 60)}
      </Text>
    </View>
  )

  const lottie = useRef<any>()

  const euroInput = useRef<any>()
  const centInput = useRef<any>()

  const isDefaultPaymentMethodSetupMessage =
    'Keine Zahlmethode festgelegt. Bitte speichere eine Zahlmethode mit der du anschließend bezahlen möchtest.'

  let { partnerID, partnerName } = route?.params

  const [euro, setEuro] = useState<string>()
  const [cent, setCent] = useState<string>()
  const [price, setPrice] = useState<number>(0)

  const [paymentError, setPaymentError] = useState<string>()
  const [inputError, setInputError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [paymentComplete, setPaymentComplete] = useState<boolean>(false)
  const [invalidCharacter, setInvalidCharacter] = useState<boolean>(false)

  const [offSessionPayment] = useOffSessionPaymentMutation()
  const navigation = useNavigation()

  const { isDefaultPaymentMethodSetup } = useAppSelector(userSelector)

  useEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home')
        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [navigation])
  )

  useEffect(() => {
    if (euroInput.current) {
      setTimeout(() => {
        euroInput.current.focus()
      }, 250)
    }
  }, [])

  useEffect(() => {
    if (lottie?.current) lottie.current.play()
  }, [lottie?.current, paymentComplete])

  useEffect(() => {
    const euroInCent = euro ? Number(polishValue(euro)) * 100 : 0
    const fixedCent = cent ? Number(polishValue(cent)) : 0

    setPrice(euroInCent + fixedCent)
  }, [euro, cent])

  useEffect(() => {
    if (inputError) {
      setInputError(!validatePrice(price))
    }
  }, [price, inputError])

  const polishValue = (value: string | undefined) =>
    value ? value.replace(/\D/g, '') : undefined

  const handleEuroChange = (value: string | undefined) => {
    const isNum = value ? /^\d+$/.test(value) : true

    if (!isNum) {
      centInput.current.focus()
    }

    setEuro(polishValue(value))
  }

  const fixCentOnBlur = () => {
    const paddedValue = _.padEnd(cent, 2, '0')
    setCent(paddedValue)
  }

  const validatePrice = (value: number) => {
    const amount = value ? Number(value) : 0
    return 100 <= amount && amount <= 20000
  }

  const getPriceInStringFormat = () => `${euro},${cent ? cent : '00'}€`

  const handlePayment = async () => {
    console.log('handlePayment')

    try {
      if (!validatePrice(price)) {
        setInputError(true)
        return
      }

      setInputError(false)
      setLoading(true)

      const { data, errors } = await offSessionPayment({
        variables: { amount: price, partnerID }
      })

      if (errors) {
        console.log('Setup intent confirmation error', errors)
        setPaymentError('Zahlung fehlgeschlagen')
        return
      }

      setPaymentComplete(true)
    } catch (e) {
      setPaymentError('Zahlung fehlgeschlagen')
      log.error('PaymentScreen/handlePayment', e)
    } finally {
      setLoading(false)
    }
  }

  const getInput = () => (
    <View
      key={'getInput'}
      style={tailwind(
        'w-full flex-grow flex flex-col justify-center items-center'
      )}
    >
      <View style={tailwind('flex flex-row items-center')}>
        <Incubator.TextField
          key="textfield_euro"
          style={tailwind('text-4xl')}
          placeholder="0"
          placeholderTextColor={Colors.grey50}
          labelColor={Colors.jungleGreen}
          color={Colors.jungleGreen}
          maxLength={3}
          value={euro}
          onChangeText={handleEuroChange}
          textAlign="right"
          keyboardType="number-pad"
          containerStyle={tailwind('w-20 bg-gray-50 rounded-lg pt-1')}
        />

        <Text newBlack style={tailwind('text-4xl mx-0.5')}>
          ,
        </Text>

        <Incubator.TextField
          key="textfield_cent"
          ref={centInput}
          style={tailwind('text-4xl')}
          placeholder="00"
          placeholderTextColor={Colors.grey50}
          labelColor={Colors.jungleGreen}
          color={Colors.jungleGreen}
          maxLength={2}
          value={cent}
          onChangeText={(value) => setCent(polishValue(value))}
          onBlur={(_) => fixCentOnBlur()}
          textAlign="left"
          keyboardType="number-pad"
          containerStyle={tailwind('w-16 bg-gray-50 rounded-lg pt-1')}
        />

        <FontAwesome name="euro" size={36} color={Colors.jungleGreen} />
      </View>

      {!inputError && !invalidCharacter ? (
        <Text thin newBlack style={tailwind('mt-2 text-center text-lg')}>
          Zahlbetrag eingeben
        </Text>
      ) : (
        <Text thin bittersweet style={tailwind('mt-2 text-center text-lg')}>
          {invalidCharacter ? 'nur Ziffern' : '1,00€ bis 200,00€'}
        </Text>
      )}
    </View>
  )

  const getPaymentCompleteScreen = () => (
    <View
      key="getPaymentCompleteScreen"
      style={{
        ...tailwind('relative flex-grow flex flex-col items-center px-6')
      }}
    >
      <Text
        newBlack
        style={tailwind('mt-4 text-2xl text-center bg-white rounded-lg px-4')}
      >
        Vielen Dank für deinen Einkauf!
      </Text>

      <View style={tailwind('absolute bottom-8 self-center inset-x-0')}>
        <View
          style={{
            zIndex: -10,
            ...tailwind('overflow-hidden h-64 flex items-center justify-center')
          }}
        >
          <View
            style={{
              zIndex: -10,
              ...tailwind('relative')
            }}
          >
            <LottieView
              ref={lottie}
              style={{
                zIndex: 10,
                ...tailwind('absolute -bottom-8')
              }}
              source={require('@assets/lottie/cow.json')}
            />

            <GrasBackground width={320} height={320} />
          </View>
        </View>

        <View style={tailwind('px-6 flex flex-col items-center text-center')}>
          <View style={tailwind('flex flex-row')}>
            <Text thin jungleGreen>
              {getPriceInStringFormat()}
            </Text>
            <Text thin newBlack style={tailwind('ml-1')}>
              an
            </Text>
          </View>

          <Text semibold jungleGreen style={tailwind('text-center')}>
            {partnerName}
          </Text>

          <Text thin newBlack style={tailwind('ml-2  text-center')}>
            bezahlt.
          </Text>
        </View>

        <Button
          label={'OK'}
          style={tailwind('bg-white mx-16 mt-4')}
          onPress={() => navigation.navigate('Home')}
          color={Colors.jungleGreen}
          outlineColor={Colors.jungleGreen}
          outline
        />
      </View>
    </View>
  )

  return (
    <FlowLayout
      error={
        !isDefaultPaymentMethodSetup
          ? isDefaultPaymentMethodSetupMessage
          : paymentError
      }
      loading={loading}
      getHeader={getHeader}
      renderConfirmButton={!paymentComplete}
      handleButtonConfirm={handlePayment}
      errorButtonAction={
        !isDefaultPaymentMethodSetup
          ? { label: 'Beheben', navigateTo: 'PaymentSettings' }
          : undefined
      }
    >
      {!paymentComplete ? [getInput()] : [getPaymentCompleteScreen()]}
    </FlowLayout>
  )
}
