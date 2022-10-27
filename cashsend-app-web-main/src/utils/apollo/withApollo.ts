import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client'
import { NextPageContext } from 'next'
import { createWithApollo } from './createWithApollo'

let httpLink = (ctx: NextPageContext) => {
  return new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include',
    headers: {
      cookies:
        typeof window === 'undefined'
          ? (ctx?.req?.headers.cookie as string)
          : 'undefined',
      'Bypass-Tunnel-Reminder': 'anything',
    },
  })
}

const apolloClient = (ctx: NextPageContext) =>
  new ApolloClient({
    link: from([httpLink(ctx)]),
    uri: process.env.NEXT_PUBLIC_API_URL,

    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {},
        },
      },
    }),
  })

export default createWithApollo(apolloClient)
