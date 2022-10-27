import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import { Colors, FloatingButton, Text, Button } from 'react-native-ui-lib'

const FloatingButtonExample = () => {
  const [showButton, setShowButton] = useState(false)
  const [showSecondary, setShowSecondary] = useState(true)

  const notNow = () => {
    Alert.alert('Not Now!')
    setShowButton(false)
  }

  const close = () => {
    Alert.alert('Closed.')
    setShowButton(false)
  }

  return (
    <View style={styles.container}>
      <Text text60 center marginB-s4>
        Trigger Floating Button
      </Text>

      <View flex-1 marginB-s4>
        <Button
          label="toggle"
          onPress={() => setShowButton(!showButton)}
          style={{ width: 100 }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View paddingT-20>
          <Text text70 style={{ fontWeight: 'bold' }}>
            INFO: The floating button is usually glued on the bottom of the screen.
            For now it isn't because it is in this view for convinience
          </Text>
          <Text text80 marginT-10 style={{ lineHeight: 24 }}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry standard dummy text ever
            since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only
            five centuries, but also th
          </Text>
        </View>
      </ScrollView>

      <FloatingButton
        visible={showButton}
        button={{
          label: 'Approve',
          onPress: close
        }}
        secondaryButton={
          showSecondary
            ? {
                label: 'Not now',
                onPress: notNow,
                color: Colors.bittersweet
              }
            : undefined
        }
        // bottomMargin={80}
        // hideBackgroundOverlay
        // withoutAnimation
      />
    </View>
  )
}

export default FloatingButtonExample

const styles = StyleSheet.create({
  container: {
    padding: 30,
    paddingBottom: 0,
    flex: 1,
    backgroundColor: Colors.newWhite
  }
})
