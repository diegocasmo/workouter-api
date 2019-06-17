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
})
