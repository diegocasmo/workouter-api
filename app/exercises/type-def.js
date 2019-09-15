const { gql } = require('apollo-server')

const typeDef = gql`
  type Exercise {
    _id: ID!
    name: String!
    author: User!
    createdAt: String!
    updatedAt: String!
  }

  extend type Query {
    getExercise(exerciseId: ID!): Exercise
    fetchExercises(offset: Int!, limit: Int!): [Exercise]
  }

  extend type Mutation {
    createExercise(name: String!): Exercise
    updateExercise(exerciseId: ID!, name: String!): Exercise
    deleteExercise(exerciseId: ID!): Exercise
  }
`

module.exports = {
  typeDef,
}
