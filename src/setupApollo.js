import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'

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

const authLink = setContext(async (_, { headers }) => {
  const token = (await localStorage.getItem('token')) || ''
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  }
})

const httpLink = new HttpLink({ uri: '/api' })

const cache = new InMemoryCache()

// const link = ApolloLink.from([httpLink, authLink])
const client = new ApolloClient({
  cache,
  link: authLink.concat(httpLink),
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
