import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Text, View, Button, Colors } from 'react-native-ui-lib'
import FloatingButtonExample from './FloatingButtonExample'
import { FontAwesome, AntDesign } from '@expo/vector-icons'
import { colorsPalette } from 'react-native-ui-lib/generatedTypes/style/colorsPalette'

const ButtonBox = () => {
  const ButtonSpace = 10

  const labelButton = { label: 'Animated' }
  const icon = require('@assets/images/favicon.png')
  const iconButton = { round: true, iconStyle: { tintColor: Colors.white } }

  type buttonPropsType = { label: string } | { round: boolean; iconStyle: any }

  const [buttonProps, setButtonProps] = useState<buttonPropsType>(labelButton)

  const changeProps = () => {
    if (buttonProps === labelButton) {
      setButtonProps(iconButton)
    }
    if (buttonProps === iconButton) {
      setButtonProps(labelButton)
    }
  }
  return (
    <View>
      <Text text50 marginB-20>
        {' '}
        This are some butons{' '}
      </Text>

      {/* Full bodied */}
      <View marginB-20>
        <Button
          label="Yes"
          labelStyle={{ fontWeight: '600' }}
          style={{ marginBottom: ButtonSpace }}
          backgroundColor={Colors.jungleGreen}
          enableShadow
        />
        <Button
          label={'No'}
          backgroundColor={Colors.bittersweet}
          style={{ marginBottom: ButtonSpace }}
        />
      </View>

      {/* Different Colors Variant */}
      {/* <View marginB-20>
        <Button
        label="Yes"
        labelStyle={{ fontWeight: '600' }}
        style={{ marginBottom: ButtonSpace }}
        backgroundColor={Colors.deco}
        enableShadow
      />
      <Button
        label={'No'}
        backgroundColor={Colors.romantic}
        style={{ marginBottom: ButtonSpace }}
      />
      </View> */}

      {/* Disabled */}
      <View marginB-20>
        <Button
          label={'Disabled'}
          disabled
          backgroundColor={Colors.bittersweet}
          style={{ marginBottom: ButtonSpace }}
        />
        <Button
          label="disabled outline"
          outline
          disabled
          // iconSource={icon}
          style={{ marginBottom: ButtonSpace }}
        />
      </View>

      {/* Outline */}
      <View marginB-20>
        <Button label="Yes" outline style={{ marginBottom: ButtonSpace }} />
        <Button
          label="No"
          color={Colors.bittersweet}
          outlineColor={Colors.bittersweet}
          outline
          style={{ marginBottom: ButtonSpace }}
        />
      </View>

      {/* IconButton */}
      <View marginB-20 center row style={{ justifyContent: 'space-around' }}>
        <FontAwesome.Button
          name="google"
          backgroundColor="#4285F4"
          // onPress={loginWithFacebook}
        >
          Login with Google
        </FontAwesome.Button>
        <AntDesign.Button
          name="setting"
          size={24}
          color="black"
          backgroundColor={Colors.newWhite}
        />
      </View>

      {/* Floating Button Example */}
      <View style={{ marginBottom: 50 }}>
        <FloatingButtonExample />
      </View>
      {/* <Button
        size='small'
        style={{ marginBottom: ButtonSpace / 4, marginLeft: ButtonSpace }}
        backgroundColor={Colors.green20}
        iconSource={icon}
        {...buttonProps}
        onPress={() => changeProps()}
        iconOnRight
        animateLayout
      /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee'
  }
})

export default ButtonBox
