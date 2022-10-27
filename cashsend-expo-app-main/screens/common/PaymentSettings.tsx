import ApplePay from '@assets/svg/ApplePay.svg'
import GooglePay from '@assets/svg/GooglePay.svg'
import { SimpleLayout } from '@components/SimpleLayout'
import { SimpleLoadingMessage } from '@components/SimpleLoadingMessage'
import { ConnectionErrorToast } from '@components/toast/ConnectionErrorToast'
import { GenericErrorToast } from '@components/toast/GenericErrorToast'
import { SuccessToast } from '@components/toast/SuccessToast'
import {
  PaymentMethodOptions,
  StripePublicKeyQuery,
  useCreateSetupIntentMutation,
  useStripePublicKeyQuery
} from '@generated/graphql-react'
import { useNavigation } from '@react-navigation/native'
import {
  startCancelSetup,
  startFetchPaymentMethod,
  startLoadPaymentMethod,
  startRemovePaymentMethod,
  userSelector
} from '@redux/slices/userSlice'
import { useAppSelector } from '@redux/typedHooks'
import {
  CardField,
  initStripe,
  PaymentMethodCreateParams,
  useConfirmSetupIntent
} from '@stripe/stripe-react-native'
import { log } from '@utils/logger'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert } from 'react-native'
import {
  Button,
  Colors,
  Constants,
  Dialog,
  PanningProvider,
  Picker,
  Text,
  TextField,
  View
} from 'react-native-ui-lib'
import { useDispatch } from 'react-redux'
import tailwind from 'tailwind-rn'

type PaymentMethod = 'google_pay' | 'apple_pay' | 'sepa_debit' | 'card'
type PickerItem = { label: string; value: PaymentMethod }

const options: PickerItem[] = [
  // { label: 'Google Pay', value: 'google_pay' },
  // { label: 'Apple Pay', value: 'apple_pay' },
  { label: 'Sepa', value: 'sepa_debit' },
  { label: 'Kreditkarte', value: 'card' }
]

export default function PaymentSettingsScreen() {
  const {
    email,
    isDefaultPaymentMethodSetup,
    isDefaultPaymentMethodProcessing,
    defaultPaymentMethod,
    isLoadingPaymentMethod,
    errors
  } = useAppSelector(userSelector)
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const { confirmSetupIntent, loading: loadingSetupIntent } =
    useConfirmSetupIntent()
  const [createSetupIntent] = useCreateSetupIntentMutation()
  const { data, networkStatus } = useStripePublicKeyQuery()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
  const [wasPmProcessing, setWasPmProcessing] = useState<boolean>(false)

  const [iban, setIban] = useState('')
  const [cardComplete, setCardComplete] = useState<boolean>(false)
  const [cardholderName, setCardholderName] = useState<string>('')

  const [nameError, setNameError] = useState<string>('')
  const [ibanError, setIbanError] = useState<string>('')
  const [cardError, setCardError] = useState<boolean>(false)

  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const [showError, setShowError] = useState<boolean>(false)
  const [showConnectionError, setShowConnectionError] = useState<boolean>(false)
  const [initLoading, setInitLoading] = useState(true)

  useEffect(() => {
    setShowError(!!errors)
  }, [errors])

  useEffect(() => {
    try {
      if (!data) {
        return
      }

      if (!isDefaultPaymentMethodSetup) {
        dispatch(startLoadPaymentMethod())
      }

      async function initialize(data: StripePublicKeyQuery | undefined) {
        const publishableKey = data?.pay_stripePublicKey

        if (publishableKey) {
          await initStripe({
            publishableKey,
            merchantIdentifier: process.env.STRIPE_MERCHANT_IDENTIFIER,
            urlScheme: process.env.STRIPE_URL_SCHEME,
            setUrlSchemeOnAndroid: true
          })

          setInitLoading(false)
        }
      }

      initialize(data)
      // eslint-disable-next-line react-@hooks/exhaustive-deps
    } catch (e: any) {
      log.error('PaymentSettings/useEffect_InitStripe', e)

      Alert.alert('Fehler', e.toString())
    }
  }, [data, networkStatus])

  // cleanup
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (!wasPmProcessing) {
        dispatch(startCancelSetup())
      }
    })

    return unsubscribe
  }, [navigation, wasPmProcessing])

  useEffect(() => {
    if (!isLoadingPaymentMethod) {
      setWasPmProcessing(!!isDefaultPaymentMethodProcessing)
    }
  }, [isDefaultPaymentMethodProcessing])

  const handleCardholderName = (name: string) => {
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
    } catch (e: any) {
      setShowConnectionError(true)
      log.error('PaymentSettings/createSetupIntentOnBackend', e)

      Alert.alert('Fehler', e.toString())
    }
  }

  const validatePaymentMethod = () => {
    try {
      let isIbanOrCardEntered = false
      const isNameError = nameError !== ''

      setNameError(
        cardholderName.length <= 3 || !cardholderName.includes(' ')
          ? 'Ungültig. Bitte vollständigen Namen angeben.'
          : ''
      )

      switch (paymentMethod) {
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
    } catch (e: any) {
      log.error('PaymentSettings/validatePaymentMethod', e)

      Alert.alert('Fehler', e.toString())
    }
  }

  const handleSaveMethod = async () => {
    try {
      if (!validatePaymentMethod()) return

      const clientSecret = await createSetupIntentOnBackend()

      if (!clientSecret) {
        setShowConnectionError(true)
        throw new Error(
          'Keine Verbindung zu dem Server erreicht. Client Secret wurde nicht erstellt.'
        )
      }

      const billingDetails: PaymentMethodCreateParams.BillingDetails = {
        name: cardholderName,
        email
      }

      const setupData =
        paymentMethod === 'sepa_debit'
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
        setShowConnectionError(true)

        throw new Error(
          `Stripe SetupError ${setupError.message}, code: ${setupError.code} decline code: ${setupError.declineCode}`
        )
      } else if (setupIntent) {
        setShowSuccess(true)

        console.log('setupIntent', setupIntent)

        dispatch(
          startFetchPaymentMethod({
            paymentMethodId: setupIntent.paymentMethodId as string
          })
        )
      }
    } catch (e: any) {
      log.error('PaymentSettings/handleSaveMethod', e)

      Alert.alert('Fehler', e.toString())
    }
  }

  const handleRemovePayment = () => {
    dispatch(startRemovePaymentMethod())
    setShowDialog(false)
  }

  const renderPaymentMethod = () => (
    <View
      key="renderPaymentMethod"
      style={tailwind('mt-16 flex flex-col w-full items-start')}
    >
      {isLoadingPaymentMethod ? (
        <View
          style={tailwind('w-full h-full flex items-center justify-center')}
        >
          <SimpleLoadingMessage />
        </View>
      ) : (
        <View
          style={tailwind('w-full mt-16 rounded-lg px-4 py-2 mt-2 bg-gray-100')}
        >
          {isDefaultPaymentMethodProcessing ? (
            <>
              <View style={tailwind('w-full flex items-start justify-around')}>
                <Text semibold shadowGreen>
                  Die Zahlungsmethode wird verarbeited
                </Text>
                <Text thin newBlack>
                  Könnte ein paar Minuten dauern
                </Text>
              </View>
            </>
          ) : (
            // Card Element
            <View style={tailwind('w-full flex items-start justify-around')}>
              <Text semibold shadowGreen>
                {defaultPaymentMethod?.type === PaymentMethodOptions.Card
                  ? 'Kreditkarte'
                  : 'Sepa Lastenschrift'}
              </Text>

              <View style={tailwind('mt-4 flex ')}>
                <Text thin newBlack>
                  {defaultPaymentMethod?.type === PaymentMethodOptions.Card
                    ? 'Kartennummer endet mit'
                    : 'Iban endet mit'}
                </Text>
                <Text semibold newBlack>
                  {defaultPaymentMethod?.last4}
                </Text>
              </View>

              <View style={tailwind('mt-4 flex')}>
                <Text thin newBlack>
                  Karteninhaber:in
                </Text>
                <Text semibold newBlack>
                  {defaultPaymentMethod?.owner
                    ? defaultPaymentMethod?.owner
                    : cardholderName}
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* remove button */}
      {!isDefaultPaymentMethodProcessing ? (
        <View
          style={tailwind('self-end pr-2 pt-2')}
          key="removePaymentMethod"
          onTouchEnd={() => setShowDialog(true)}
        >
          <Text thin newBlack>
            entfernen
          </Text>
        </View>
      ) : (
        <View
          style={tailwind('px-2 pt-2 w-full flex flex-row justify-between')}
          key="reloadOrCancelPayment"
          onTouchEnd={() => dispatch(startLoadPaymentMethod())}
        >
          <View
            onTouchEnd={() => dispatch(startCancelSetup({ withReload: true }))}
          >
            <Text thin bittersweet>
              abbrechen
            </Text>
          </View>
          <View onTouchEnd={() => dispatch(startLoadPaymentMethod())}>
            <Text thin newBlack>
              erneut laden
            </Text>
          </View>
        </View>
      )}
    </View>
  )

  const renderPicker = () => (
    <View key="picker" style={tailwind('w-full flex flex-col justify-center')}>
      <Text thin>Zahlungs Option</Text>
      <Picker
        migrate
        value={paymentMethod}
        onChange={(value: PaymentMethod) => setPaymentMethod(value)}
      >
        {options.map((option: PickerItem) => (
          <Picker.Item
            key={option.value}
            value={option.value}
            label={option.label}
          />
        ))}
      </Picker>
    </View>
  )

  const renderApplePay = () => (
    <View
      key="renderApplyPay"
      style={tailwind(
        'w-full border-2 border-gray-400 bg-gray-50 rounded-lg flex items-center justify-center'
      )}
    >
      <ApplePay width={100} height={100} />
    </View>
  )

  const renderGooglePay = () => (
    <View
      key="renderGooglePay"
      style={tailwind(
        'w-full border-2 border-gray-400 bg-gray-50 rounded-lg flex items-center justify-center'
      )}
    >
      <GooglePay width={100} height={100} />
    </View>
  )

  const renderSepa = () => (
    <View key="renderSepa">
      <Text thin>Iban</Text>

      <TextField
        value={iban}
        placeholder="AT00 0000 0000 0000 0000"
        error={ibanError}
        onChangeText={handleIban}
      />
    </View>
  )

  const renderCard = () => (
    <View key="renderCard">
      {cardError && (
        <Text semidold bittersweet>
          Bitte vollständig ausfüllen
        </Text>
      )}
      <CardField
        postalCodeEnabled={false}
        onCardChange={(cardDetails) => {
          setCardComplete(cardDetails.complete)
        }}
        style={tailwind('w-full h-11')}
      />
    </View>
  )

  const renderPaymentMethodSetup = (pm: PaymentMethod) => {
    switch (pm) {
      case 'apple_pay':
        return renderApplePay()
      case 'google_pay':
        return renderGooglePay()
      case 'sepa_debit':
        return renderSepa()
      case 'card':
        return renderCard()
    }
  }

  const renderSetup = () => (
    <View
      key="renderSetup"
      style={tailwind('mt-16 flex flex-col w-full items-start')}
    >
      {[renderPicker()]}

      <View style={tailwind('mt-4 w-full')}>
        <Text thin>
          {paymentMethod === 'card' || paymentMethod === 'sepa_debit'
            ? 'Karten'
            : 'Wallet'}
          inhaber:in
        </Text>
        <TextField
          value={cardholderName}
          error={nameError}
          onChangeText={handleCardholderName}
        />
      </View>

      <View style={tailwind('mt-4 w-full')}>
        {[renderPaymentMethodSetup(paymentMethod)]}
      </View>

      <Button
        label={!loadingSetupIntent && !initLoading ? 'Speichern' : ''}
        style={tailwind('mt-4 w-full')}
        onPress={handleSaveMethod}
        disabled={loadingSetupIntent || initLoading}
      >
        {(loadingSetupIntent || initLoading) && (
          <ActivityIndicator size="large" color={Colors.white} />
        )}
      </Button>

      {paymentMethod === 'sepa_debit' && (
        <View style={tailwind('w-full text-center mt-4')}>
          <Text thin center>
            Ich authorisiere (A) cashsend Zahlungen von meinem Konto via Direkt
            Debit abzubuchen. Weiters (B) stimme ich meiner Bank zu, die
            Zahlungen von cashsend auszugleichen. Anmerkung: Ich kann eine
            Rückerstattung innerhalb von 8 Wochen ab dem Buchungsdatum
            einfordern. Die verinbarten Bankkondition sind geltend.
          </Text>
        </View>
      )}
    </View>
  )

  const renderDialog = () => (
    <Dialog
      useSafeArea
      key="renderDialog"
      height={300}
      panDirection={PanningProvider.Directions.DOWN}
      containerStyle={{
        marginBottom: Constants.isIphoneX ? 0 : 20,
        ...tailwind('bg-white rounded-lg')
      }}
      visible={showDialog}
      onDismiss={() => setShowDialog(false)}
      ignoreBackgroundPress={false}
    >
      <View
        style={tailwind(
          'w-full h-full px-4 flex flex-col items-center justify-center '
        )}
      >
        <View style={tailwind('')}>
          <Text newBlack style={tailwind('text-2xl text-center')}>
            Zahlungsmethode entfernen?
          </Text>
          <Text thin newBlack style={tailwind('mt-4 text-center')}>
            Kann nicht rückgängig gemacht werden. Du kannst danach aber eine
            neue festlegen.
          </Text>
        </View>
        <View style={tailwind('flex flex-row justify-around w-full mt-4')}>
          <Button
            label="Entfernen"
            onPress={handleRemovePayment}
            color={Colors.bittersweet}
            outlineColor={Colors.bittersweet}
            outline
          />
          <Button
            label="Abbrechen"
            onPress={() => setShowDialog(false)}
            color={Colors.grey40}
            outlineColor={Colors.grey40}
            outline
          />
        </View>
      </View>
    </Dialog>
  )

  return (
    <View>
      <SimpleLayout>
        {isDefaultPaymentMethodSetup || isDefaultPaymentMethodProcessing
          ? [renderPaymentMethod()]
          : [renderSetup()]}

        {[renderDialog()]}

        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <Text style={{ opacity: 0 }}>appium fix</Text>
      </SimpleLayout>

      <SuccessToast
        isVisible={showSuccess}
        setVisible={setShowSuccess}
        message="Erfolgreich gespeichert!"
        position="top"
      />

      <ConnectionErrorToast
        isVisible={showConnectionError}
        setVisible={setShowConnectionError}
      />

      <GenericErrorToast isVisible={showError} setVisible={setShowError} />
    </View>
  )
}
