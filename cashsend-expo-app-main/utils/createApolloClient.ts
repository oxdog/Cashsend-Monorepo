import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import * as SecureStore from 'expo-secure-store'

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_ENDPOINT
})

const authLink = setContext(async (_, { headers }) => {
  let token = await SecureStore.getItemAsync('authToken')

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  headers: __DEV__
    ? {
        'Bypass-Tunnel-Reminder': 'anything' //this is for localhost tunnel url to skip init page
      }
    : {}
})
