import React from 'react'
import { Colors, Text, View } from 'react-native-ui-lib'
import tailwind from 'tailwind-rn'

export default function FontTesting() {
  return (
    <View style={tailwind('flex-1 bg-white py-12 px-8')}>
      <Text logotext_large>cashsend</Text>
      <Text logotext_regular>cashsend</Text>

      <Text h1 style={tailwind('mt-2')}>
        Heading
      </Text>

      <Text h2 style={tailwind('mt-2')}>
        Heading
      </Text>

      <Text style={tailwind('mt-2')}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere, fugiat
        ipsum! Modi
        <Text semibold style={tailwind('mt-2')}>
          this is very important
        </Text>
        nesciunt voluptatum recusandae, ipsa reiciendis tempore soluta.
      </Text>

      <Text thin style={tailwind('mt-2')}>
        Some footnote with Lorem ipsum dolor sit amet consectetur adipisicing
        recusandae, ipsa reiciendis tempore soluta.
      </Text>

      {/* <Text
        style={tailwind('mt-2')}
      >
        this is very important
      </Text> */}
    </View>
  )
}
