const { constructServer } = require('../../../apollo-server')
const { createTestClient } = require('apollo-server-testing')
const { Factory } = require('rosie')
const { expect } = require('chai')
const mongoose = require('mongoose')
const users = require('../../users/')
const exercises = require('../')

const transformExerciseToResolverTypes = x => ({
  ...x.toJSON({ versionKey: false }),
  _id: `${x._id}`,
  createdAt: `${x.createdAt.getTime()}`,
  updatedAt: `${x.updatedAt.getTime()}`,
})

const transformUserToResolverTypes = x => ({
  ...x.toJSON({ versionKey: false }),
  _id: `${x._id}`,
  createdAt: `${x.createdAt.getTime()}`,
  updatedAt: `${x.updatedAt.getTime()}`,
})

describe('Exercise Resolvers', () => {
  describe('fetchExercises', () => {
    const FETCH_EXERCISES_QUERY = `
      query fetchExercises($offset: Int!, $limit: Int!) {
        fetchExercises(offset: $offset, limit: $limit) {
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

    it('returns paginated exercises sorted by ascending name', async () => {
      // Insert a list of exercises in DB
      const currentUser = await users.Model(Factory.build('user')).save()
      const res = await exercises.Model.insertMany(
        Factory.buildList('exercise', 20, { author: currentUser._id })
      )

      // console.log(firstPage);
      // Assume user is authenticated
      const { server } = constructServer({
        context: () => ({ currentUser }),
      })

      // Retrieve a page of 12 exercises
      const { query } = createTestClient(server)
      const { data, errors } = await query({
        query: FETCH_EXERCISES_QUERY,
        variables: { offset: 0, limit: 12 },
      })

      // Verify exercises were correctly paginated
      const expected = res
        .sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        )
        .map(x => ({
          ...transformExerciseToResolverTypes(x),
          author: { ...transformUserToResolverTypes(currentUser) },
        }))

      expect(data.fetchExercises).to.be.eql(expected.slice(0, 12))
    })

    it('requires authentication', async () => {
      // Assume there is no user authenticated
      const { server } = constructServer({})

      const { query } = createTestClient(server)
      const { data, errors } = await query({
        query: FETCH_EXERCISES_QUERY,
        variables: { offset: 0, limit: 10 },
      })

      expect(data.fetchExercises).to.be.null
      expect(errors[0].message).to.be.equal('You must be logged in')
    })
  })

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
      const currentUser = await users.Model(Factory.build('user')).save()

      // Assume user is authenticated
      const { server } = constructServer({
        context: () => ({ currentUser }),
      })

      // Create an exercise that belongs to the user
      const exercise = await exercises
        .Model(Factory.build('exercise', { author: currentUser._id }))
        .save()

      const { query } = createTestClient(server)
      const { data } = await query({
        query: GET_EXERCISE_QUERY,
        variables: { exerciseId: `${exercise._id}` },
      })

      expect(data.getExercise).to.be.eql({
        ...transformExerciseToResolverTypes(exercise),
        author: { ...transformUserToResolverTypes(currentUser) },
      })
    })

    it('requires authentication', async () => {
      // Assume there is no user authenticated
      const { server } = constructServer({})

      const { query } = createTestClient(server)
      const { data, errors } = await query({
        query: GET_EXERCISE_QUERY,
        variables: { exerciseId: `${mongoose.Types.ObjectId()}` },
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
        context: () => ({ currentUser }),
      })

      // Create valid exercise attributes
      const expected = Factory.build('exercise', { author: currentUser._id })

      const { mutate } = createTestClient(server)
      const { data } = await mutate({
        mutation: CREATE_EXERCISE_MUTATION,
        variables: { name: expected.name },
      })

      expect(data.createExercise._id).to.not.be.null
      expect(data.createExercise.name).to.be.equal(expected.name)
      expect(data.createExercise.author._id).to.be.equal(
        transformUserToResolverTypes(currentUser)._id
      )
      expect(data.createExercise.createdAt).to.not.be.null
      expect(data.createExercise.updatedAt).to.not.be.null
    })

    it('requires authentication', async () => {
      // Assume there is no user authenticated
      const { server } = constructServer({})

      const { mutate } = createTestClient(server)
      const { data, errors } = await mutate({
        mutation: CREATE_EXERCISE_MUTATION,
        variables: { name: 'foo bar' },
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
        context: () => ({ currentUser }),
      })

      // Create valid exercise in DB
      const exercise = await exercises
        .Model(Factory.build('exercise', { author: currentUser._id }))
        .save()

      // Update exercise
      const name = 'foo bar'
      const { mutate } = createTestClient(server)
      const { data } = await mutate({
        mutation: UPDATE_EXERCISE_MUTATION,
        variables: { exerciseId: `${exercise._id}`, name },
      })

      expect(data.updateExercise._id).to.be.equal(
        transformExerciseToResolverTypes(exercise)._id
      )
      expect(data.updateExercise.name).to.be.equal(name)
      expect(data.updateExercise.author._id).to.be.equal(
        transformUserToResolverTypes(currentUser)._id
      )
      expect(data.updateExercise.createdAt).to.not.be.null
      expect(data.updateExercise.updatedAt).to.not.be.null
    })

    it('requires authentication', async () => {
      // Assume there is no user authenticated
      const { server } = constructServer({})

      const { mutate } = createTestClient(server)
      const { data, errors } = await mutate({
        mutation: UPDATE_EXERCISE_MUTATION,
        variables: { exerciseId: '123', name: 'foo bar' },
      })

      expect(data.updateExercise).to.be.null
      expect(errors[0].message).to.be.equal('You must be logged in')
    })
  })

  describe('deleteExercise', () => {
    const DELETE_EXERCISE_MUTATION = `
      mutation deleteExercise($exerciseId: ID!) {
        deleteExercise(exerciseId: $exerciseId) {
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

    it('deletes an exercise', async () => {
      const currentUser = await users.Model(Factory.build('user')).save()

      // Assume user is authenticated
      const { server } = constructServer({
        context: () => ({ currentUser }),
      })

      // Create valid exercise in DB
      const exercise = await exercises
        .Model(Factory.build('exercise', { author: currentUser._id }))
        .save()

      // Delete exercise
      const { mutate } = createTestClient(server)
      const { data } = await mutate({
        mutation: DELETE_EXERCISE_MUTATION,
        variables: { exerciseId: `${exercise._id}` },
      })

      const exerciseInDb = await exercises.Model.findOne(exercise._id)

      expect(exerciseInDb).to.be.null
      expect(data.deleteExercise._id).to.be.equal(
        transformExerciseToResolverTypes(exercise)._id
      )
      expect(data.deleteExercise.author._id).to.be.equal(
        transformUserToResolverTypes(currentUser)._id
      )
      expect(data.deleteExercise.createdAt).to.not.be.null
      expect(data.deleteExercise.updatedAt).to.not.be.null
    })

    it('requires authenticated', async () => {
      // Assume there is no user authenticated
      const { server } = constructServer({})

      const { mutate } = createTestClient(server)
      const { data, errors } = await mutate({
        mutation: DELETE_EXERCISE_MUTATION,
        variables: { exerciseId: '123' },
      })

      expect(data.deleteExercise).to.be.null
      expect(errors[0].message).to.be.equal('You must be logged in')
    })
  })
})
