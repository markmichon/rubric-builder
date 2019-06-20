import { gql } from 'apollo-server-express'
export const typeDefs = gql`
  type Query {
    getMe: User!
    getRubrics: [Rubric]
    getRubric(id: String!): Rubric
  }

  type Mutation {
    login(email: String!, password: String!): UserPayload!
    signup(email: String!, password: String!): UserPayload!
    makeRubric(rubric: RubricInput): Rubric
    updateRubric(rubric: RubricInput): SuccessState
  }

  type SuccessState {
    success: Boolean!
  }
  type User {
    email: String!
  }

  type UserPayload {
    user: User!
    token: String!
  }

  type Rubric {
    id: ID!
    owner: String!
    name: String!
    levels: [Level]
    topics: [Topic]
  }

  type Level {
    id: ID!
    name: String!
    weight: Int!
  }

  type Topic {
    id: ID!
    name: String!
    weight: Int!
    criteria: [Criteria]!
  }

  type Criteria {
    id: ID!
    description: String!
    disabled: Boolean!
  }

  input RubricInput {
    id: ID!
    name: String!
    levels: [LevelInput]
    topics: [TopicInput]
  }

  input LevelInput {
    name: String!
    weight: Int!
  }

  input TopicInput {
    name: String!
    weight: Int!
    criteria: [CriteriaInput]!
  }

  input CriteriaInput {
    description: String!
    disabled: Boolean
  }
`
