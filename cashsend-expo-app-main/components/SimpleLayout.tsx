import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { View, Colors, TouchableOpacity } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'

interface SimpleLayoutProps {}

export const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const navigation = useNavigation()

  return (
    <View style={tailwind('relative h-full w-full bg-white')}>
      <TouchableOpacity
        style={{
          zIndex: 30,
          ...tailwind(
            'absolute right-4 top-4 bg-white p-2 rounded-full flex flex-row items-end'
          )
        }}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="close" size={24} color={Colors.newBlack} />
      </TouchableOpacity>
      <ScrollView style={tailwind('h-full w-full px-4')}>{children}</ScrollView>
    </View>
  )
}
