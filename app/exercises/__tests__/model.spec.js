require('../../../test-utils/setup')
const { Factory } = require('rosie')
const { expect } = require('chai')
const users = require('../../users/')
const exercises = require('../')

describe('Exercise Model', () => {

  it('can create a valid exercise', async () => {
    const expected = await exercises.Model(Factory.build('exercise')).save()
    const actual = await exercises.Model.findOne(expected._id)
    expect(expected.toJSON()).to.be.eql(actual.toJSON())
  })

  describe('validation', () => {

    it('requires a name', () => {
      const exercise = exercises.Model(Factory.build('exercise', { name: '' }))
      const { errors } = exercise.validateSync()
      expect(errors.name.message).to.be.equal('Exercise name is required')
    })

    it('requires exercise name to be unique', async () => {
      // Create an exercise
      const name = 'foo bar'
      const exercise = exercises.Model(Factory.build('exercise', { name }))
      const res = await exercise.save()
      expect(res.toJSON()).to.be.eql(exercise.toJSON())

      // Attempt to create another exercise with the same name
      try {
        await exercises.Model(Factory.build('exercise', { name })).save()
      } catch({ errors }) {
        expect(errors.name.message).to.be.equal('Exercise name must be unique')
      }
    })

    it('requires a user_id', async () => {
      try {
        await exercises.Model(Factory.build('exercise', { user_id: null })).save()
      } catch({ errors }) {
        expect(errors.user_id.message).to.be.equal('Exercise user_id is required')
      }
    })
  })
})
