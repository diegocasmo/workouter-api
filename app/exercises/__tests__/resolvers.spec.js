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
          user_id
          createdAt
          updatedAt
        }
      }
    `
    it('returns exercise if it exists', async () => {
      const currentUser = await users.Model(Factory.build('user')).save()

      // Assume user is authenticated
      const { server } = constructServer({
        context: () => ({ currentUser })
      })

      // Create an exercise that belongs to the user
      const attrs = Factory.build('exercise', { user_id: currentUser._id })
      const exercise = await exercises.Model(attrs).save()
      const { __v, ...expected } = exercise.toJSON()

      const { query } = createTestClient(server)
      const { data } = await query({
        query: GET_EXERCISE_QUERY,
        variables: { exerciseId: `${expected._id}` }
      })

      expect(data.getExercise).to.be.eql({
        ...expected,
        _id: `${expected._id}`,
        user_id: `${expected.user_id}`,
        createdAt: `${expected.createdAt.getTime()}`,
        updatedAt: `${expected.updatedAt.getTime()}`
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
          user_id
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
      const expected = Factory.build('exercise', { user_id: currentUser._id })

      const { mutate } = createTestClient(server)
      const { data } = await mutate({
        mutation: CREATE_EXERCISE_MUTATION,
        variables: { name: `${expected.name}` }
      })

      const actual = data.createExercise
      expect(actual._id).to.not.be.null
      expect(actual.name).to.be.equal(expected.name)
      expect(actual.user_id).to.be.equal(`${expected.user_id}`)
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
})
