import HappyFace from '@assets/svg/HappyFace.svg'
import { ResetPasswordDialog } from '@components/ResetPasswordDialog'
import { SimpleLayout } from '@components/SimpleLayout'
import { SupportPrompt } from '@components/SupportPrompt'
import { ConnectionErrorToast } from '@components/toast/ConnectionErrorToast'
import { SuccessToast } from '@components/toast/SuccessToast'
import { startUpdateUser, userSelector } from '@redux/slices/userSlice'
import { useAppSelector } from '@redux/typedHooks'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'
import { Button, Colors, Text, TextField, View } from 'react-native-ui-lib'
import { useDispatch } from 'react-redux'
import tailwind from 'tailwind-rn'

export default function SettingsScreen() {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  const [nameError, setNameError] = useState<string>('')

  const [showSuccess, setShowSuccess] = useState<boolean>(false)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const [showConnectionError, setShowConnectionError] = useState<boolean>(false)

  const {
    firstName,
    email: reduxEmail,
    isLoading,
    errors
  } = useAppSelector(userSelector)

  useEffect(() => {
    setName(firstName || '')
    setEmail(reduxEmail || '')
  }, [])

  useEffect(() => {
    if (isUpdating && !isLoading && !errors) {
      setIsUpdating(false)
      setShowSuccess(true)
    }
  }, [isUpdating, isLoading, errors])

  const dispatch = useDispatch()

  const handleSave = () => {
    dispatch(startUpdateUser({ firstName: name }))
    setIsUpdating(true)
  }

  const handleFirstName = (name: string) => {
    setNameError(name === '' ? 'Kann nicht leer sein' : '')
    setName(name)
  }

  const handleError = () => {
    setShowConnectionError(true)
  }

  return (
    <View>
      <SimpleLayout>
        <View
          style={tailwind(
            'mt-16 flex flex-col w-full items-center justify-between'
          )}
        >
          <View
            style={{
              backgroundColor: Colors.goldenTainoi,
              ...tailwind(
                'bg-yellow-400 border border-gray-200 rounded-full p-1'
              )
            }}
          >
            {/* <Avatar
            containerStyle={{
              marginVertical: 5
            }}
            size={90}
            animate={true}
            imageProps={{ animationDuration: 500 }}
            source={{
              uri: 'https://static.pexels.com/photos/60628/flower-garden-blue-sky-hokkaido-japan-60628.jpeg'
            }}
          /> */}
            <HappyFace width={90} height={90} />
          </View>
          <Text thin>ändern</Text>

          <View style={tailwind('mt-6 w-4/5')}>
            <View>
              <Text thin>Vorname</Text>
              <TextField
                value={name}
                error={nameError}
                onChangeText={handleFirstName}
              />
            </View>

            <View style={tailwind('mt-4')}>
              <Text thin>Email</Text>
              <Text semibold shadowGreen>
                {email}
              </Text>
            </View>

            <View style={tailwind('mt-4')}>
              <Text
                thin
                style={tailwind('underline')}
                onPress={() => setShowDialog(true)}
              >
                Passwort ändern
              </Text>
            </View>
          </View>

          <Button
            style={tailwind('mt-8 mb-8')}
            onPress={handleSave}
            disabled={nameError !== ''}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color={Colors.white} />
            ) : (
              <Text newWhite semibold>
                Speichern
              </Text>
            )}
          </Button>
        </View>

        <ResetPasswordDialog
          email={email}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
          handleError={handleError}
        />
      </SimpleLayout>

      <View style={tailwind('absolute bottom-8 inset-x-0')}>
        <SupportPrompt />
      </View>
      <SuccessToast
        isVisible={showSuccess}
        setVisible={setShowSuccess}
        message="Erfolgreich gespeichert!"
      />

      <ConnectionErrorToast
        isVisible={showConnectionError}
        setVisible={setShowConnectionError}
      />
    </View>
  )
}
