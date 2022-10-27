import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome,
  MaterialIcons
} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { startLogout } from '@redux/slices/authSlice'
import { userSelector } from '@redux/slices/userSlice'
import { useAppSelector } from '@redux/typedHooks'
import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Colors, ExpandableSection, Text } from 'react-native-ui-lib'
import { useDispatch } from 'react-redux'
import tailwind from 'tailwind-rn'

interface HomeScreenNavBarProps {}

export const HomeScreenNavBar: React.FC<HomeScreenNavBarProps> = ({}) => {
  const [expanded, setExpanded] = useState<boolean>(false)

  const { firstName } = useAppSelector(userSelector)
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const getHeaderElement = () => (
    <View
      style={tailwind(
        'relative w-full px-6 pt-6 pb-2 bg-white flex flex-row items-center justify-between'
      )}
    >
      <Text semibold>Hallo {firstName}!</Text>

      {!expanded ? (
        <Feather name="menu" size={24} color={Colors.newBlack} />
      ) : (
        <AntDesign name="close" size={24} color={Colors.newBlack} />
      )}
    </View>
  )

  const getBodyElement = () => (
    <View style={{ zIndex: 10, ...tailwind('flex flex-col bg-white px-4') }}>
      <TouchableOpacity
        style={tailwind('w-full flex flex-row py-4')}
        onPress={() => navigation.navigate('ProfileSettings')}
      >
        <View style={tailwind('w-12 flex items-center justify-center px-2')}>
          <FontAwesome name="user" size={24} color={Colors.newBlack} />
        </View>
        <Text> Profil </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tailwind('w-full flex flex-row py-4 border-t-2 border-gray-100')}
        onPress={() => navigation.navigate('PaymentSettings')}
      >
        <View style={tailwind('w-12 flex items-center justify-center px-2')}>
          <Entypo name="credit-card" size={24} color={Colors.newBlack} />
        </View>
        <Text> Zahlungsmethode </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tailwind('w-full flex flex-row py-4 border-t-2 border-gray-100')}
        onPress={() => navigation.navigate('PaymentHistory')}
      >
        <View style={tailwind('w-12 flex items-center justify-center px-2')}>
          <FontAwesome
            name="shopping-basket"
            size={24}
            color={Colors.newBlack}
          />
        </View>
        <Text> Einkäufe </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tailwind('w-full flex flex-row py-4 border-t-2 border-gray-100')}
        onPress={() => dispatch(startLogout())}
      >
        <View style={tailwind('w-12 flex items-center justify-center px-2')}>
          <MaterialIcons name="logout" size={24} color={Colors.bittersweet} />
        </View>
        <Text bittersweet> Ausloggen </Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <>
      <View style={{ zIndex: 10, ...tailwind('bg-white w-full') }}>
        <ExpandableSection
          top={false}
          expanded={expanded}
          sectionHeader={getHeaderElement()}
          onPress={() => setExpanded(!expanded)}
        >
          {getBodyElement()}
        </ExpandableSection>
      </View>

      {expanded && (
        <View
          style={{
            zIndex: 5,
            ...tailwind('absolute inset-0 bg-white opacity-50')
          }}
          onTouchEnd={() => setExpanded(!expanded)}
        />
      )}
    </>
  )
}
