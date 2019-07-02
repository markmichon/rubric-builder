import { gql } from 'apollo-server-express'
export const typeDefs = gql`
  type Query {
    me: User!
    rubrics: [Rubric]
    rubric(id: String!): Rubric
  }

  type Mutation {
    login(email: String!, password: String!): UserPayload!
    signup(email: String!, password: String!): UserPayload!
    saveRubric(rubric: RubricInput): SuccessState
    updateRubric(rubric: RubricInput): SuccessState
    deleteRubric(id: String!): SuccessState
  }

  type SuccessState {
    success: Boolean!
    error: String
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
    ### Should these be here, or should they be handled dynamically on the client
    levelName: String!
    weight: Int!
  }

  input RubricInput {
    id: ID
    name: String!
    levels: [LevelInput]
    topics: [TopicInput]
  }

  input LevelInput {
    id: ID
    name: String!
    weight: Int!
  }

  input TopicInput {
    id: ID
    name: String!
    weight: Int!
    criteria: [CriteriaInput]!
  }

  input CriteriaInput {
    id: ID
    description: String
    disabled: Boolean
    levelName: String!
    weight: Int!
  }
`
