const { Factory } = require('rosie')
const { expect } = require('chai')
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

    it('requires a author', async () => {
      try {
        await exercises
          .Model(Factory.build('exercise', { author: null }))
          .save()
      } catch ({ errors }) {
        expect(errors.author.message).to.be.equal('Exercise author is required')
      }
    })
  })
})
