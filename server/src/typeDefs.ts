import { gql } from 'apollo-server-express'
export const typeDefs = gql`
  type User {
    email: String!
  }

  type UserPayload {
    user: User!
    token: String!
  }

  type Query {
    getMe: User!
  }

  type Mutation {
    login(email: String!, password: String!): UserPayload!
    signup(email: String!, password: String!): UserPayload!
  }
`
