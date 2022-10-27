import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { Text, View } from 'react-native-ui-lib'

const ColorBox = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text text50 marginB-20>
        This are the colors
      </Text>
      <View style={styles.container}>
        <View style={styles.colorRow}>
          <View //white
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              backgroundColor: '#fdfff5'
            }}
          />
          <View //egg-white
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              backgroundColor: '#fff4c5'
            }}
          />
        </View>
        <View style={styles.colorRow}>
          <View //deco
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              backgroundColor: '#bedd9a'
            }}
          />

          <View //golden-tainoi
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              backgroundColor: '#fece63'
            }}
          />
        </View>
        <View style={styles.colorRow}>
          <View //shadow-green
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              backgroundColor: '#9ecec0'
            }}
          />
          <View //romantic
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              backgroundColor: '#fec9b4'
            }}
          />
        </View>
        <View style={styles.colorRow}>
          <View //jungle-green
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              backgroundColor: '#32a37f'
            }}
          />

          <View //bittersweet
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              backgroundColor: '#fd6f63'
            }}
          />
        </View>
        <View style={styles.colorRow}>
          <View //deep-sea-green
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              backgroundColor: '#0a6259'
            }}
          />
          <View //black
            style={{
              width: 100,
              height: 100,
              borderRadius: 10,
              backgroundColor: '#182b33'
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eeeeee'
  },
  colorRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20
  }
})

export default ColorBox
