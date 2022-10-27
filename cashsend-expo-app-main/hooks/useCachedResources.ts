import { configureTheme } from '@config/themeConfig'
import { Ionicons } from '@expo/vector-icons'
import {
  confirmAGB,
  networkError,
  startInitAuth
} from '@redux/slices/authSlice'
import { resetUser } from '@redux/slices/userSlice'
import store from '@redux/store'
import { log } from '@utils/logger'
import * as Font from 'expo-font'
import * as Network from 'expo-network'
import * as SecureStore from 'expo-secure-store'
import * as SplashScreen from 'expo-splash-screen'
import * as React from 'react'

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false)

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync()

        await Font.loadAsync({
          ...Ionicons.font,
          'omnes-semibold-italic': require('@assets/fonts/omnes-pro-semibold-italic.otf'),
          'omnes-extraLight-italic': require('@assets/fonts/omnes-pro-extraLight-italic.otf'),
          'bieder-book': require('@assets/fonts/bieder-book.otf'),
          'bieder-semibold': require('@assets/fonts/bieder-semibold.otf'),
          'bieder-thin': require('@assets/fonts/bieder-thin.otf')
        })

        configureTheme()

        const token = await SecureStore.getItemAsync('authToken')
        const agbVersion = await SecureStore.getItemAsync('AGB_VERSION')
        const { isConnected } = await Network.getNetworkStateAsync()

        if (agbVersion) {
          store.dispatch(confirmAGB())
        }

        if (!isConnected) {
          store.dispatch(networkError())
        } else if (token) {
          store.dispatch(startInitAuth())
        } else {
          store.dispatch(resetUser())
        }
      } catch (e) {
        log.error(e)
      } finally {
        setLoadingComplete(true)
        SplashScreen.hideAsync()
      }
    }

    loadResourcesAndDataAsync()
  }, [])

  return isLoadingComplete
}
