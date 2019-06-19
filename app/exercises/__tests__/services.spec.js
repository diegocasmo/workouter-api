require('../../../test-utils/setup')
const { Factory } = require('rosie')
const { expect } = require('chai')
const mongoose = require('mongoose')
const users = require('../../users/')
const exercises = require('../')

describe('Exercise Service', () => {

  describe('getExercise', () => {

    it('returns an exercise if it exists', async () => {
      const expected = await exercises.Model(Factory.build('exercise')).save()
      const actual = await exercises.services.getExercise({
        exerciseId: expected._id,
        userId: expected.user_id
      })
      expect(expected.toJSON()).to.be.eql(actual.toJSON())
    })

    it('returns null if no exercise exists', async () => {
      const res = await exercises.services.getExercise({
        exerciseId: mongoose.Types.ObjectId(),
        userId: mongoose.Types.ObjectId()
      })
      expect(res).to.be.null
    })
  })

  describe('createExercise', () => {

    it('creates a valid exercise', async () => {
      const user = await users.Model(Factory.build('user')).save()
      const attrs = Factory.build('exercise', { user_id: user._id })
      const actual = await exercises.services.createExercise({
        name: attrs.name,
        userId: attrs.user_id
      })
      const expected = await exercises.Model.findOne({ name: attrs.name })
      expect(actual.toJSON()).to.be.eql(expected.toJSON())
    })

    it("validates 'user_id' exists", async () => {
      // Create exercise attributes with a non-existent `user_id`
      const attrs = Factory.build('exercise')
      try {
        await exercises.services.createExercise({
          name: attrs.name,
          userId: attrs.user_id
        })
      } catch (err) {
        expect(err.message).to.be.equal('Exercise user_id does not exist')
      }
    })
  })
})
