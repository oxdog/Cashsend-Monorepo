import { useNavigation } from '@react-navigation/native'
import type { PaymentMethodCreateParams } from '@stripe/stripe-react-native'
import { CardField, useConfirmSetupIntent } from '@stripe/stripe-react-native'
import React, { useState } from 'react'
import { ActivityIndicator, Alert } from 'react-native'
import {
  Button,
  Colors,
  RadioButton,
  RadioGroup,
  TextField,
  View,
  Text
} from 'react-native-ui-lib'
import { useDispatch } from 'react-redux'
import tailwind from 'tailwind-rn'
import { PaymentScreenWrapper } from '@components/PaymentScreenWrapper'
import { useCreateSetupIntentMutation } from '@generated/graphql-react'
import { startFetchPaymentMethod, userSelector } from '@redux/slices/userSlice'
import { useAppSelector } from '@redux/typedHooks'
import { log } from '@utils/logger'

type SetupType = 'card' | 'sepa_debit'
interface AmountScreenProps {
  route: { params: { successRedirect: string; failureRedirect: string } }
  navigation: any
}

export const SepaSetupFuturePaymentScreen: React.FC<AmountScreenProps> = ({
  route = { params: { successRedirect: 'Home', failureRedirect: 'Home' } }
}) => {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const { successRedirect, failureRedirect } = route.params
  const { email } = useAppSelector(userSelector)

  const [type, setType] = useState<SetupType>('card')

  const { confirmSetupIntent, loading } = useConfirmSetupIntent()
  const [createSetupIntent] = useCreateSetupIntentMutation()

  const [iban, setIban] = useState('')
  const [cardComplete, setCardComplete] = useState<boolean>(false)
  const [cardholderName, setCardholderName] = useState<string>('')

  const [nameError, setNameError] = useState<string>('')
  const [ibanError, setIbanError] = useState<string>('')
  const [cardError, setCardError] = useState<boolean>(false)

  const handleLastName = (name: string) => {
    setNameError(name === '' ? 'Kann nicht leer sein' : '')
    setCardholderName(name)
  }

  const handleIban = (iban: string) => {
    setIbanError(iban === '' ? 'Bitte vollständig ausfüllen' : '')
    setIban(iban.toLowerCase())
  }

  const createSetupIntentOnBackend = async () => {
    try {
      const { data } = await createSetupIntent()
      const clientSecret = data?.pay_createSetupIntent.clientSecret

      return clientSecret!
    } catch (e) {
      log.error('SetupScreen/createSetupIntentOnBackend', e)
      Alert.alert('Keine Verbindung zu dem Server ...')
      navigation.navigate(failureRedirect)
    }
  }

  const validatePaymentMethod = () => {
    let isIbanOrCardEntered = false
    const isNameError = nameError !== ''

    setNameError(
      cardholderName.length <= 3 || !cardholderName.includes(' ')
        ? 'Ungültig. Bitte vollständigen Namen angeben.'
        : ''
    )

    switch (type) {
      case 'card':
        setCardError(!cardComplete)
        isIbanOrCardEntered = cardComplete
        break
      case 'sepa_debit':
        setIbanError(iban === '' ? 'Bitte vollständig ausfüllen' : '')
        isIbanOrCardEntered = iban !== ''
        break
      default:
        break
    }

    return !isNameError && isIbanOrCardEntered
  }

  const handleSaveMethod = async () => {
    if (!validatePaymentMethod()) return

    const clientSecret = await createSetupIntentOnBackend()

    if (!clientSecret) {
      Alert.prompt(
        'Keine Verbindung zu dem Server erreicht. Client Secret wurde nicht erstellt.'
      )

      log.error(
        'PaymentSettings/handleSaveMethod',
        'Keine Verbindung zu dem Server erreicht. Client Secret wurde nicht erstellt.'
      )
      return
    }

    const billingDetails: PaymentMethodCreateParams.BillingDetails = {
      name: cardholderName,
      email
    }

    const setupData =
      type === 'sepa_debit'
        ? ({
            type: 'SepaDebit',
            billingDetails,
            iban,
            setupFutureUsage: 'OffSession'
          } as PaymentMethodCreateParams.SepaParams)
        : ({
            type: 'Card',
            billingDetails,
            setupFutureUsage: 'OffSession'
          } as PaymentMethodCreateParams.CardParams)

    const { error: setupError, setupIntent } = await confirmSetupIntent(
      clientSecret,
      {
        ...setupData
      }
    )

    if (setupError) {
      Alert.alert(`Error code: ${setupError.code}`, setupError.message)

      log.error(
        'PaymentSettings/handleSaveMethod',
        'Setup intent confirmation error',
        setupError.message
      )
    } else if (setupIntent) {
      Alert.alert(
        'Success',
        `Setup intent created. Intent status: ${setupIntent.status}`
      )

      dispatch(
        startFetchPaymentMethod({
          paymentMethodId: setupIntent.paymentMethodId as string
        })
      )

      navigation.navigate(successRedirect)
    }
  }

  return (
    <PaymentScreenWrapper>
      <View style={tailwind('w-full h-full px-4 pt-24 flex flex-col')}>
        {/* Cardholder Details */}
        <View style={tailwind('w-full ')}>
          <Text thin>KarteninhaberIn</Text>

          <TextField
            value={cardholderName}
            error={nameError}
            onChangeText={handleLastName}
          />
        </View>

        {/* Payment Elements */}
        <View style={tailwind('w-full flex flex-col justify-center h-32')}>
          {type === 'card' ? (
            <>
              <Text thin>Kreditkarte</Text>
              {cardError && (
                <Text semidold bittersweet>
                  Bitte vollständig ausfüllen
                </Text>
              )}
              <CardField
                postalCodeEnabled={false}
                onCardChange={(cardDetails) => {
                  console.log('card details', cardDetails)
                  setCardComplete(cardDetails.complete)
                }}
                style={tailwind('w-full h-12')}
              />
            </>
          ) : (
            <>
              <Text thin>Iban</Text>
              <TextField
                value={iban}
                placeholder="AT00 0000 0000 0000 0000"
                error={ibanError}
                onChangeText={handleIban}
              />
            </>
          )}
        </View>

        <View style={tailwind('w-full mt-4 ')}>
          <RadioGroup
            initialValue={type}
            onValueChange={(value: SetupType) => setType(value)}
          >
            <View row centerV marginB-5>
              <RadioButton
                value={'card'}
                label="Kreditkarte"
                color={Colors.jungleGreen}
              />
            </View>
            <View row centerV marginB-5>
              <RadioButton
                value={'sepa_debit'}
                label="Sepa Lastenschrift"
                color={Colors.jungleGreen}
              />
            </View>
          </RadioGroup>
        </View>

        <Button
          disabled={loading}
          marginT-32
          label={!loading ? 'Speichern' : ''}
          onPress={handleSaveMethod}
        >
          {loading && <ActivityIndicator size="large" color={Colors.white} />}
        </Button>

        {type === 'sepa_debit' && (
          <View style={tailwind('w-full mt-4  text-center self-end')}>
            <Text thin center>
              Ich authorisiere (A) cashsend Zahlungen von meinem Konto via
              Direkt Debit abzubuchen. Weiters (B) stimme ich meiner Bank zu,
              die Zahlungen von cashsend auszugleichen. Anmerkung: Ich kann eine
              Rückerstattung innerhalb von 8 Wochen ab dem Buchungsdatum
              einfordern. Die verinbarten Bankkondition sind geltend.
            </Text>
          </View>
        )}
      </View>
    </PaymentScreenWrapper>
  )
}
