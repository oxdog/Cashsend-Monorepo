import { AntDesign } from '@expo/vector-icons'
import { useRequestPasswordResetMutation } from '@generated/graphql-react'
import { log } from '@utils/logger'
import LottieView from 'lottie-react-native'
import React, { useEffect, useRef, useState } from 'react'
import {
  Button,
  Colors,
  Constants,
  Dialog,
  PanningProvider,
  Text,
  TouchableOpacity,
  View
} from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'

interface ResetPasswordDialogProps {
  showDialog: boolean
  setShowDialog: (x: boolean) => void
  email: string
  handleError: () => void
}

export const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
  email,
  setShowDialog,
  showDialog,
  handleError
}) => {
  const [requestReset, state] = useRequestPasswordResetMutation()
  const [showSuccess, setShowSuccess] = useState<boolean>(false)

  const lottie = useRef<any>()

  useEffect(() => {
    if (lottie?.current) {
      lottie.current.reset()
      lottie.current.play()
    }
  }, [lottie?.current, showSuccess])

  const handleSendLink = async () => {
    try {
      await requestReset({
        variables: {
          email
        }
      })

      setShowSuccess(true)
      setTimeout(handleCloseDialog, 10000)
    } catch (e) {
      log.error('Error at handleSendLink:', e)
      handleCloseDialog()
      handleError()
    }
  }

  const handleCloseDialog = () => {
    setShowDialog(false)
    setShowSuccess(false)
  }

  const getButtons = () => (
    <View
      key="getButtons"
      style={tailwind('flex flex-row justify-around w-full mt-8')}
    >
      <Button
        label={'OK'}
        style={tailwind('')}
        onPress={handleSendLink}
        color={Colors.jungleGreen}
        outlineColor={Colors.jungleGreen}
        outline
        disabled={state.loading}
      />
      <Button
        label={'Abbrechen'}
        style={tailwind('')}
        onPress={handleCloseDialog}
        color={Colors.grey40}
        outlineColor={Colors.grey40}
        outline
        disabled={state.loading}
      />
    </View>
  )

  const getPrompt = () => (
    <View style={tailwind('')}>
      <Text newBlack style={tailwind('text-2xl text-center')}>
        Password ändern?
      </Text>
      <Text thin newBlack style={tailwind('mt-6 text-center')}>
        Wir senden dir einen Link an {email} um das Passwort zurück zu setzen.
      </Text>
    </View>
  )

  const getLoading = () => (
    <View style={tailwind('')}>
      <Text thin newBlack style={tailwind('text-center')}>
        Email wird gesendet ...
      </Text>
    </View>
  )

  const getSuccess = () => (
    <>
      <TouchableOpacity
        style={{
          zIndex: 30,
          ...tailwind(
            'absolute right-4 top-4 bg-white p-2 rounded-full flex flex-row items-end'
          )
        }}
        onPress={handleCloseDialog}
      >
        <AntDesign name="close" size={24} color={Colors.newBlack} />
      </TouchableOpacity>

      <View style={tailwind('flex flex-col justify-center items-center')}>
        <LottieView
          ref={lottie}
          style={tailwind('h-32 w-32')}
          source={require('@assets/lottie/emailSent.json')}
          loop={false}
        />
        <Text newBlack style={tailwind('text-center')}>
          Erfolgreich!
        </Text>
        <Text thin newBlack style={tailwind('mt-2 text-center')}>
          Könnte ein paar Minuten dauern bis sie ankommt. Seh auch in dem Spam
          Ordner nach sollte sie länger brauchen.
        </Text>
      </View>
    </>
  )

  return (
    <Dialog
      // migrate
      useSafeArea
      key={'renderDialog'}
      height={300}
      panDirection={PanningProvider.Directions.DOWN}
      containerStyle={{
        marginBottom: Constants.isIphoneX ? 0 : 20,
        ...tailwind('bg-white rounded-lg')
      }}
      visible={showDialog}
      onDismiss={handleCloseDialog}
      // renderPannableHeader={renderPannableHeader}
      // pannableHeaderProps={{ title: 'This is a pannable header Dialog' }}
      // supportedOrientations={this.supportedOrientations}
      ignoreBackgroundPress={state.loading}
    >
      <View
        style={tailwind(
          'w-full h-full px-4 flex flex-col items-center justify-center '
        )}
      >
        {showSuccess
          ? [getSuccess()]
          : state.loading
          ? [getLoading()]
          : [getPrompt(), [getButtons()]]}
      </View>
    </Dialog>
  )
}
