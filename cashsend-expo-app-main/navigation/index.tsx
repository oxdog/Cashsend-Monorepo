import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { authSelector } from '@redux/slices/authSlice'
import { useAppSelector } from '@redux/typedHooks'
import AGB from '@screens/auth/AGB'
import ForgotPassword from '@screens/auth/ForgotPassword'
import SignIn from '@screens/auth/SignIn'
import SignUpDetails from '@screens/auth/SignUpDetails'
import SignUpMain from '@screens/auth/SignUpMain'
import VerifyEmail from '@screens/auth/VerifyEmail'
import Home from '@screens/common/HomeScreen'
import LoadingScreen from '@screens/common/LoadingScreen'
import PaymentHistory from '@screens/common/PaymentHistory'
import PaymentSettings from '@screens/common/PaymentSettings'
import ProfileSettings from '@screens/common/ProfileSettings'
import { QRScanner } from '@screens/common/QRScanner'
import FontTesting from '@screens/dev/FontTesting'
import PushNotification from '@screens/dev/PushNotification'
import AmountScreen from '@screens/payment/AmountScreen'
import { PaymentScreen } from '@screens/payment/PaymentScreen'
import { SepaSetupFuturePaymentScreen as SetupScreen } from '@screens/payment/SetupScreen'
import StripeInApp from '@screens/payment/StripeInApp'
import React from 'react'
import { ColorSchemeName } from 'react-native'

const loginRegisterScreens = {
  SignUpMain,
  SignUpDetails,
  SignIn,
  ForgotPassword
}

const userScreens = {
  AmountScreen,
  FontTesting,
  Home,
  PaymentHistory,
  PaymentScreen,
  PaymentSettings,
  ProfileSettings,
  PushNotification,
  QRScanner,
  SetupScreen,
  StripeInApp
}

export default function Navigation({
  colorScheme
}: {
  colorScheme: ColorSchemeName
}) {
  // const navigationRef = useRef()
  // const routeNameRef = useRef()

  return (
    <NavigationContainer
      // ref={navigationRef}
      // linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      // onStateChange={async () => {
      //   const previousRouteName = routeNameRef.current
      //   const currentRouteName = navigationRef.current.getCurrentRoute().name

      //   routeNameRef.current = currentRouteName
      // }}
    >
      <RootNavigator />
    </NavigationContainer>
  )
}

const Stack = createStackNavigator()

const AuthNavigator = () => {
  const { isLoggedIn, isAGB } = useAppSelector(authSelector)

  return (
    <Stack.Navigator
      initialRouteName="SignUpMain"
      screenOptions={{ headerShown: false, gestureEnabled: true }}
    >
      {isAGB ? (
        !isLoggedIn ? (
          Object.entries({
            ...loginRegisterScreens
          }).map(([name, component]) => (
            <Stack.Screen name={name} component={component} key={name} />
          ))
        ) : (
          <Stack.Screen
            name={'VerifyEmail'}
            component={VerifyEmail}
            key={'VerifyEmail'}
          />
        )
      ) : (
        <Stack.Screen name={'AGB'} component={AGB} key={'AGB'} />
      )}
    </Stack.Navigator>
  )
}

const LoggedInNavigator = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{ headerShown: false, gestureEnabled: true }}
  >
    {Object.entries({
      ...userScreens
      // ...commonScreens
    }).map(([name, component]) => (
      <Stack.Screen name={name} component={component} key={name} />
    ))}
  </Stack.Navigator>
)

function RootNavigator() {
  const { isLoading, isLoggedIn, isVerified } = useAppSelector(authSelector)

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: true }}
    >
      {isLoading ? (
        <Stack.Screen
          name={'SplashScreen'}
          component={LoadingScreen}
          key={'SplashScreen'}
        />
      ) : isLoggedIn && isVerified ? (
        <Stack.Screen
          name={'LoggedInNavigator'}
          component={LoggedInNavigator}
          key={'LoggedInNavigator'}
        />
      ) : (
        <Stack.Screen
          name={'AuthNavigator'}
          component={AuthNavigator}
          key={'AuthNavigator'}
        />
      )}
    </Stack.Navigator>
  )
}
