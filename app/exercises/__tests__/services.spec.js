require('../../../test-utils/setup')
const { Factory } = require('rosie')
const { expect } = require('chai')
const mongoose = require('mongoose')
const users = require('../../users/')
const exercises = require('../')

describe('Exercise Service', () => {

  describe('getExercise', () => {

    it('returns an exercise if it exists', async () => {
      const user = await users.Model(Factory.build('user')).save()
      const exercise = await exercises.Model(Factory.build('exercise', { author: user._id })).save()
      const expected = { ...exercise.toJSON(), author: user.toJSON() }

      const actual = await exercises.services.getExercise({
        exerciseId: expected._id,
        author: expected.author
      })

      expect(actual.toJSON()).to.be.eql(expected)
    })

    it('returns null if no exercise exists', async () => {
      const res = await exercises.services.getExercise({
        exerciseId: mongoose.Types.ObjectId(),
        author: mongoose.Types.ObjectId()
      })
      expect(res).to.be.null
    })
  })

  describe('createExercise', () => {

    it('creates a valid exercise', async () => {
      const user = await users.Model(Factory.build('user')).save()
      const { name, author } = Factory.build('exercise', { author: user._id })

      const actual = await exercises.services.createExercise({ name, author })

      const expected = await exercises.Model.findOne({ _id: actual._id, author }).populate('author')
      expect(actual.toJSON()).to.be.eql(expected.toJSON())
    })

    it("validates 'author' exists", async () => {
      // Create exercise attributes with a non-existent `author`
      const attrs = Factory.build('exercise')
      try {
        await exercises.services.createExercise({
          name: attrs.name,
          author: attrs.author
        })
      } catch (err) {
        expect(err.message).to.be.equal('Exercise author does not exist')
      }
    })
  })

  describe('updateExercise', () => {

    it('updates an existing exercise', async () => {
      // Create an exercise in DB
      const author = await users.Model(Factory.build('user')).save()
      let exercise = await exercises.Model(Factory.build('exercise', { author: author._id })).save()
      exercise = await exercises.Model.populate(exercise, 'author')

      // Update exercise
      const name = 'foo bar'
      const actual = await exercises.services.updateExercise({
        exerciseId: exercise._id,
        name,
        author: author._id
      })

      const expected = { ...exercise.toJSON(), name }
      expect(actual.toJSON()).to.be.eql(expected)
    })

    it('validates user is the author of the exercise', async () => {
      // Create an exercise in DB
      const author = await users.Model(Factory.build('user')).save()
      const exercise = await exercises.Model(Factory.build('exercise', { author: author._id })).save()

      // Create another user
      const otherUser = await users.Model(Factory.build('user')).save()

      // Attempt to make an update with the user that doesn't own the exercise
      try {
        const name = 'foo bar'
        await exercises.services.updateExercise({
          exerciseId: exercise._id,
          name,
          author: otherUser._id
        })
      } catch (err) {
        expect(err.message).to.be.equal('Exercise does not exist')
      }
    })

    it('validates updated attributes', async () => {
      // Create an exercise in DB
      const author = await users.Model(Factory.build('user')).save()
      const exercise = await exercises.Model(Factory.build('exercise', { author: author._id })).save()

      // Attempt to update exercise with an invalid `name`
      try {
        const name = ''
        await exercises.services.updateExercise({
          exerciseId: exercise._id,
          name,
          author: author._id
        })
        const res = await exercises.Model.find({})
      } catch ({ errors }) {
        expect(errors.name.message).to.be.equal('Exercise name is required')
      }
    })
  })

  describe('deleteExercise', () => {

    it('deletes an exercise', async () => {
      // Create an exercise in DB
      const author = await users.Model(Factory.build('user')).save()
      let expected = await exercises.Model(Factory.build('exercise', { author: author._id })).save()
      expected = await exercises.Model.populate(expected, 'author')

      // Delete exercise from DB
      const actual = await exercises.services.deleteExercise({ exerciseId: expected._id, author: author._id })

      // Verify exercise was deleted from DB and attributes of the
      // deleted exercise returned by the service
      const exerciseInDb = await exercises.Model.findOne(expected._id)
      expect(exerciseInDb).to.be.null
      expect(actual.toJSON()).to.be.eql(expected.toJSON())
    })

    it('validates user is the author of the exercise', async () => {
      // Create an exercise in DB
      const author = await users.Model(Factory.build('user')).save()
      const exercise = await exercises.Model(Factory.build('exercise', { author: author._id })).save()

      // Create another user
      const otherUser = await users.Model(Factory.build('user')).save()

      // Attempt to delete exercise with the wrong user
      try {
        await exercises.services.deleteExercise({
          exerciseId: exercise._id,
          author: otherUser._id
        })
      } catch (err) {
        expect(err.message).to.be.equal('Exercise does not exist')
      }
    })

    it('returns an error if exercise doesn\'t exist', async () => {
      try {
        await exercises.services.deleteExercise({
          exerciseId: mongoose.Types.ObjectId(),
          author: mongoose.Types.ObjectId()
        })
      } catch (err) {
        expect(err.message).to.be.equal('Exercise does not exist')
      }
    })
  })
})
