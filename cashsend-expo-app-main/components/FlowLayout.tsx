import { Background } from '@components/design/Background'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { elevationShadowStyle } from '@utils/elevationShadowStyle'
import React from 'react'
import { ActivityIndicator } from 'react-native'
import {
  Button,
  Colors,
  Text,
  TouchableOpacity,
  View
} from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'

interface FlowLayoutProps {
  error: string | undefined
  loading: boolean
  renderConfirmButton: boolean
  getHeader: () => JSX.Element
  handleButtonConfirm: () => void
  errorButtonAction?: { label: string; navigateTo: string }
}

export const FlowLayout: React.FC<FlowLayoutProps> = ({
  error,
  loading,
  renderConfirmButton = true,
  getHeader,
  handleButtonConfirm,
  errorButtonAction = { label: 'Erneut versuchen', navigateTo: 'Home' },
  children
}) => {
  const navigation = useNavigation()

  const getConfirmButton = () => (
    <View
      key={'_getConfirmButton'}
      style={{
        ...tailwind('absolute inset-x-0 -bottom-10')
      }}
    >
      {/* Background Fix for button */}
      <View
        style={{
          backgroundColor: Colors.jungleGreen,
          ...tailwind(
            'absolute w-20 h-20 rounded-full self-center border border-white'
          )
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: Colors.jungleGreen,
          ...tailwind('w-20 h-20 rounded-full self-center border border-white'),
          ...elevationShadowStyle(10),
          justifyContent: 'space-around'
        }}
        onPress={handleButtonConfirm}
        // disabled={loading}
      >
        {!loading ? (
          <Ionicons
            name="checkmark"
            size={72}
            color="white"
            style={tailwind('absolute inset-0 pl-1')}
          />
        ) : (
          <ActivityIndicator size="large" color={Colors.white} />
        )}
      </TouchableOpacity>
    </View>
  )

  const renderErrorScreen = () => (
    <View
      key={'_renderErrorScreen'}
      style={{
        ...tailwind('relative flex-grow flex flex-col items-center px-6')
      }}
    >
      <AntDesign
        name="warning"
        size={100}
        color={Colors.goldenTainoi}
        style={tailwind('mt-6')}
      />

      <Text newBlack style={tailwind('mt-4 text-2xl text-center')}>
        Fehler
      </Text>

      <Text thin newBlack style={tailwind('mt-4 text-center')}>
        {error}
      </Text>

      <Button
        label={errorButtonAction.label}
        style={tailwind(
          'absolute bottom-8 self-center mx-10 bg-white inset-x-0'
        )}
        onPress={() => navigation.navigate(errorButtonAction.navigateTo)}
        color={Colors.grey40}
        outlineColor={Colors.grey40}
        outline
      />
    </View>
  )

  return (
    <View style={tailwind('relative h-full w-full flex flex-col')}>
      <Background />

      <View
        style={tailwind(
          'mx-8 mt-6 h-14 flex flex-row items-center justify-center'
        )}
      >
        {[getHeader()]}
      </View>

      {/* Content box */}
      <View
        style={{
          ...elevationShadowStyle(10),
          ...tailwind('relative mx-8 mb-16 mt-2 flex-grow rounded-lg bg-white')
        }}
      >
        {!!!error ? children : [renderErrorScreen()]}

        {renderConfirmButton && !error && [getConfirmButton()]}
      </View>
    </View>
  )
}
