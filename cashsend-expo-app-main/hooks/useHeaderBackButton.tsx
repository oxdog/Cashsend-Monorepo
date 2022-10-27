import { AntDesign } from '@expo/vector-icons'
import React, { useEffect } from 'react'
import { Colors, View, Button } from 'react-native-ui-lib'
import { StyleSheet } from 'react-native'
import { elevationShadowStyle } from '@utils/elevationShadowStyle'
import { Entypo } from '@expo/vector-icons'
import tailwind from 'tailwind-rn'

export const useHeaderBackButton = (navigation) => {
  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      // headerTitle: (props) => <LogoTitle {...props} />,
      headerStyle: {
        backgroundColor: Colors.newWhite
      },
      title: '',
      headerLeft: () => (
        <Button
          style={tailwind('bg-white')}
          onPress={() => navigation.goBack()}
        >
          <Entypo
            name="chevron-with-circle-left"
            size={48}
            color={Colors.grey30}
          />
        </Button>
      )
    })
  }, [])
}

const styles = StyleSheet.create({
  button: {
    marginLeft: 16,
    borderRadius: 50,
    width: 10,
    backgroundColor: Colors.newWhite
  },
  shadow: elevationShadowStyle(10)
})
