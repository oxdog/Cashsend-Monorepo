import CSCode from '@assets/images/cashsendCode_64x64.png'
import { SimpleLoadingMessage } from '@components/SimpleLoadingMessage'
import { GenericErrorToast } from '@components/toast/GenericErrorToast'
import { Ionicons } from '@expo/vector-icons'
import { PartnerFindByIdDocument } from '@generated/graphql-react'
import {
  PartnerFindByIdQuery,
  PartnerFindByIdQueryVariables
} from '@generated/graphql-requests'
import { useNavigation } from '@react-navigation/native'
import { apolloClient } from '@utils/createApolloClient'
import { log } from '@utils/logger'
import { BarCodeScanner } from 'expo-barcode-scanner'
import * as Haptics from 'expo-haptics'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Animated, Dimensions, Easing } from 'react-native'
import { Button, Colors, Image, Text, View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'

interface QRScannerProps {}

export const QRScanner: React.FC<QRScannerProps> = ({}) => {
  const [lastScannedUrl, setLastScannedUrl] = useState<string>()
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>()
  const [flashlight, setFlashlight] = useState<boolean>(false)
  const [scanned, setScanned] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const [showScanError, setShowScanError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [scanRectangleSize] = useState<Animated.Value>(new Animated.Value(1))

  // const {} = usePartnerFindByIdQuery()

  const navigation = useNavigation()

  useEffect(() => {
    try {
      requestCameraPermission()
    } catch (e) {
      log.error('QRScanner/useEffect_CamerPermission', e)
    }
  }, [])

  useEffect(() => {
    if (hasCameraPermission) {
      startScanRectAnimation()
    } else if (hasCameraPermission === false) {
      navigation.navigate('Home')
    }
  }, [hasCameraPermission])

  const startScanRectAnimation = () => {
    try {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanRectangleSize, {
            toValue: 1,
            duration: 500,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true
          }),
          Animated.timing(scanRectangleSize, {
            toValue: 1.05,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true
          })
        ])
      ).start()
    } catch (e) {
      log.error('QRScanner/startScanRectAnimation', e)
    }
  }

  const requestCameraPermission = async () => {
    try {
      // const { status } = await Camera.requestCameraPermissionsAsync()
      const { status } = await BarCodeScanner.requestPermissionsAsync()

      setHasCameraPermission(status === 'granted')
    } catch (e) {
      log.error('QRScanner/requestCameraPermission', e)
    }
  }

  const handleBarCodeRead = async ({ data }) => {
    try {
      console.log('data', data)

      if (data !== lastScannedUrl) {
        setShowScanError(false)
        setScanned(true)
        setLastScannedUrl(data)

        const url = data.split('?') as string[]
        const params = url.length > 1 ? url[1] : undefined

        if (!params) {
          console.log('no params')
          setError('Kein gülter Code')
          return
        }

        setError(undefined)

        const isRegular = params.includes('pid')
        const _id = params.replace('pid=', '').replace('mid=', '')

        console.log('url', url)
        console.log('params', params)
        console.log('isRegular', isRegular)
        console.log('id', _id)

        setLoading(true)
        const response = await apolloClient.query<
          PartnerFindByIdQuery,
          PartnerFindByIdQueryVariables
        >({
          query: PartnerFindByIdDocument,
          variables: { _id }
        })
        const partnerName = response.data.partner_PartnerFindById.partner?.name

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

        setLoading(false)
        navigation.navigate('PaymentScreen', {
          partnerID: _id,
          partnerName
        })
      }
    } catch (e) {
      log.error('QRScanner/handleBarCodeRead', e)

      setScanned(false)
      setLoading(false)
      setShowScanError(true)
    }
  }

  return (
    <View style={tailwind('relative h-full w-full')}>
      {hasCameraPermission === undefined ? (
        <View
          style={tailwind(
            'w-full h-full bg-white flex items-center justify-center'
          )}
        >
          <SimpleLoadingMessage />
        </View>
      ) : (
        <>
          {/* This one crashes, but has flashlight. expo-camera ~11.2.2 */}
          {/* <Camera
            // onBarCodeScanned={handleBarCodeRead}
            ratio="16:9"
            style={tailwind('absolute inset-0')}
            // flashMode={flashlight ? 'torch' : 'off'}
          /> */}

          <View
            style={tailwind(
              'absolute inset-0 bg-white flex items-center justify-center'
            )}
          >
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeRead}
              style={{
                width: Dimensions.get('screen').width * 1.5,
                height: Dimensions.get('screen').height * 1.5
              }}
            />
          </View>

          <View
            style={tailwind(
              'absolute inset-0 flex items-center justify-center'
            )}
          >
            <View style={tailwind('relative pl-5')}>
              <View
                style={tailwind(
                  'absolute inset-0 p-20 flex items-center justify-center opacity-30'
                )}
              >
                <Image
                  style={tailwind('w-full h-full overflow-hidden rounded-md')}
                  source={CSCode}
                />
              </View>
              <Animated.View
                style={[
                  {
                    scaleY: scanRectangleSize,
                    scaleX: scanRectangleSize
                  }
                ]}
              >
                <Ionicons name="scan-outline" size={290} color="white" />
              </Animated.View>
            </View>

            <Text
              semibold
              bittersweet={error !== undefined}
              jungleGreen={loading}
              white={!error && !loading}
              style={tailwind('mx-16 mt-4 text-center text-lg')}
            >
              {!error
                ? loading
                  ? 'Erfolgreich gescanned, einen Moment bitte ...'
                  : 'Richte mich auf einen cashsend Code'
                : error}
            </Text>
          </View>

          {/* Buttons for flashlight */}
          {/* <View
            style={tailwind(
              'absolute flex flex-row self-center justify-between w-64 bottom-10'
            )}
          >
            <Button
              onPress={() => setFlashlight(!flashlight)}
              style={tailwind('rounded-full bg-white')}
            >
              <Ionicons name="flashlight" size={36} color={Colors.newBlack} />
            </Button>

            <Button
              onPress={() => navigation.goBack()}
              style={tailwind('rounded-full bg-white')}
            >
              <FontAwesome5 name="times" size={36} color={Colors.newBlack} />
            </Button>
          </View> */}

          <View
            style={tailwind(
              'absolute w-36 self-center justify-between bottom-10'
            )}
          >
            <Button
              label={'Abbrechen'}
              style={tailwind('')}
              onPress={() => navigation.navigate('Home')}
              color={Colors.grey80}
              outlineColor={Colors.grey80}
              outline
            />
          </View>

          <GenericErrorToast
            isVisible={showScanError}
            setVisible={setShowScanError}
          />
        </>
      )}
    </View>
  )
}
