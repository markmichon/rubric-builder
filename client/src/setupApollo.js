import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink, Observable } from 'apollo-link'

import gql from 'graphql-tag'

const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }
`

const localResolvers = {
  Query: {
    isLoggedIn: async () => await !!localStorage.getItem('token'),
  },
  Mutation: {
    logOut: (_, args, { cache }) => {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token')
      }
      const data = { data: { isLoggedIn: false } }
      cache.writeData(data)
      return data
    },
    logIn: (_, args, { cache }) => {
      const data = { data: { isLoggedIn: true } }
      cache.writeData(data)
      return data
    },
  },
}

// const request = async operation => {
//   const token = (await localStorage.getItem('token')) || ''
//   operation.setContext({
//     headers: {
//       authorization: token,
//     },
//   })
// }

const authLink = setContext(async (_, { headers }) => {
  const token = (await localStorage.getItem('token')) || ''
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' })

// const requestLink = new ApolloLink(
//   (operation, forward) =>
//     new Observable(observer => {
//       let handle
//       Promise.resolve(operation)
//         .then(oper => request(oper))
//         .then(() => {
//           handle = forward(operation).subscribe({
//             next: observer.next.bind(observer),
//             error: observer.error.bind(observer),
//             complete: observer.complete.bind(observer),
//           })
//         })
//         .catch(observer.error.bind(observer))
//       return () => {
//         if (handle) handle.unsubscribe()
//       }
//     })
// )
const cache = new InMemoryCache()
// const client = new ApolloClient({
//   link: ApolloLink.from([
//     onError(({ graphQLErrors, networkError }) => {
//       if (graphQLErrors)
//         graphQLErrors.map(({ message, locations, path }) =>
//           console.log(
//             `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
//           )
//         )
//       if (networkError) console.log(`[Network error]: ${networkError}`)
//     }),
//     requestLink,
//     new HttpLink({
//       uri: `http://localhost:4000`,
//     }),
//   ]),
//   cache,
//   resolvers: localResolvers,
//   typeDefs,
// })

const link = ApolloLink.from([httpLink, authLink])
const client = new ApolloClient({
  cache,
  link,
  typeDefs,
  resolvers: localResolvers,
})

cache.writeData({
  data: { isLoggedIn: !!localStorage.getItem('token') },
})

const Apollo = ({ children }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
)

export default Apollo
