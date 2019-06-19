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
    login(email: String!, password: String!): UserPayload!
  }

  type Mutation {
    signup(email: String!, password: String!): UserPayload!
  }
`
