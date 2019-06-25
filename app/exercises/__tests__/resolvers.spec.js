require('../../../test-utils/setup')
const { constructServer } = require('../../../apollo-server')
const { createTestClient } = require('apollo-server-testing')
const { Factory } = require('rosie')
const { expect } = require('chai')
const mongoose = require('mongoose')
const users = require('../../users/')
const exercises = require('../')

describe('Exercise Resolvers', () => {

  describe('getExercise', () => {

    const GET_EXERCISE_QUERY = `
      query getExercise($exerciseId: ID!) {
        getExercise(exerciseId: $exerciseId) {
          _id
          name
          author {
            _id
            name
            email
            pictureUrl
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }
    `

    it('returns exercise if it exists', async () => {
      let currentUser = await users.Model(Factory.build('user')).save({ versionKey: false })
      currentUser = currentUser.toJSON({ versionKey: false })

      // Assume user is authenticated
      const { server } = constructServer({
        context: () => ({ currentUser })
      })

      // Create an exercise that belongs to the user
      let exercise = await exercises.Model(Factory.build('exercise', { author: currentUser._id })).save()
      exercise = exercise.toJSON({ versionKey: false })

      const { query } = createTestClient(server)
      const { data } = await query({
        query: GET_EXERCISE_QUERY,
        variables: { exerciseId: `${exercise._id}` }
      })

      expect(data.getExercise).to.be.eql({
        ...exercise,
        _id: `${exercise._id}`,
        author: {
          ...currentUser,
          _id: `${currentUser._id}`,
          createdAt: `${currentUser.createdAt.getTime()}`,
          updatedAt: `${currentUser.updatedAt.getTime()}`
        },
        createdAt: `${exercise.createdAt.getTime()}`,
        updatedAt: `${exercise.updatedAt.getTime()}`
      })
    })

    it('requires authentication', async () => {
      // Assume there is no user authenticated
      const { server } = constructServer({})

      const { query } = createTestClient(server)
      const { data, errors } = await query({
        query: GET_EXERCISE_QUERY,
        variables: { exerciseId: `${mongoose.Types.ObjectId()}` }
      })

      expect(data.getExercise).to.be.null
      expect(errors[0].message).to.be.equal('You must be logged in')
    })
  })

  describe('createExercise', () => {

    const CREATE_EXERCISE_MUTATION = `
      mutation createExercise($name: String!) {
        createExercise(name: $name) {
          _id
          name
          author {
            _id
            name
            email
            pictureUrl
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }
    `

    it('returns created exercise if valid', async () => {
      const currentUser = await users.Model(Factory.build('user')).save()

      // Assume user is authenticated
      const { server } = constructServer({
        context: () => ({ currentUser })
      })

      // Create valid exercise attributes
      const expected = Factory.build('exercise', { author: currentUser._id })

      const { mutate } = createTestClient(server)
      const { data } = await mutate({
        mutation: CREATE_EXERCISE_MUTATION,
        variables: { name: expected.name }
      })

      const actual = data.createExercise
      expect(actual._id).to.not.be.null
      expect(actual.name).to.be.equal(expected.name)
      expect(actual.author._id).to.be.equal(`${expected.author._id}`)
      expect(actual.createdAt).to.not.be.null
      expect(actual.updatedAt).to.not.be.null
    })

    it('requires authentication', async () => {
      // Assume there is no user authenticated
      const { server } = constructServer({})

      const { mutate } = createTestClient(server)
      const { data, errors } = await mutate({
        mutation: CREATE_EXERCISE_MUTATION,
        variables: { name: 'foo bar' }
      })

      expect(data.createExercise).to.be.null
      expect(errors[0].message).to.be.equal('You must be logged in')
    })
  })

  describe('updateExercise', () => {

    const UPDATE_EXERCISE_MUTATION = `
      mutation updateExercise($exerciseId: ID!, $name: String!) {
        updateExercise(exerciseId: $exerciseId, name: $name) {
          _id
          name
          author {
            _id
            name
            email
            pictureUrl
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }
    `

    it('returns updated exercise if valid', async () => {
      const currentUser = await users.Model(Factory.build('user')).save()

      // Assume user is authenticated
      const { server } = constructServer({
        context: () => ({ currentUser })
      })

      // Create valid exercise in DB
      const exercise = await exercises.Model(Factory.build('exercise', { author: currentUser._id })).save()

      // Update exercise
      const name = 'foo bar'
      const { mutate } = createTestClient(server)
      const { data } = await mutate({
        mutation: UPDATE_EXERCISE_MUTATION,
        variables: { exerciseId: `${exercise._id}`, name }
      })

      const actual = data.updateExercise
      expect(actual._id).to.not.be.null
      expect(actual.name).to.be.equal(name)
      expect(actual.author._id).to.be.equal(`${exercise.author._id}`)
      expect(actual.createdAt).to.not.be.null
      expect(actual.updatedAt).to.not.be.null
    })

    it('requires authentication', async () => {
      // Assume there is no user authenticated
      const { server } = constructServer({})

      const { mutate } = createTestClient(server)
      const { data, errors } = await mutate({
        mutation: UPDATE_EXERCISE_MUTATION,
        variables: { exerciseId: '123', name: 'foo bar' }
      })

      expect(data.updateExercise).to.be.null
      expect(errors[0].message).to.be.equal('You must be logged in')
    })
  })
})
