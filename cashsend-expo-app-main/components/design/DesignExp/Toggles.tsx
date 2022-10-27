import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Checkbox, Colors, Text, View } from 'react-native-ui-lib'

export default function Toggles() {
  const [checkboxVal, setCheckboxVal] = useState<boolean>(false)

  return (
    <View style={styles.container}>
      <Text text50 marginB-10>
        Here are some toggles
      </Text>
      <View>
        <Text text70 marginH-10 marginB-5>
          Checkbox
        </Text>
        <Checkbox
          // disabled
          value={checkboxVal}
          label={'With label'}
          color={Colors.green20}
          onValueChange={() => setCheckboxVal(!checkboxVal)}
          containerStyle={{ marginBottom: 5, marginLeft: 20}}
        />
        <Checkbox
          disabled
          value={checkboxVal}
          label={'Disabled'}
          color={Colors.green20}
          onValueChange={() => setCheckboxVal(!checkboxVal)}
          containerStyle={{ marginBottom: 20, marginLeft: 20}}
        />
      </View>
      {/* <View>
        <Text text70 marginH-10 marginB-5>
          Radio
        </Text>
        
      </View> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfff5'
  }
})
