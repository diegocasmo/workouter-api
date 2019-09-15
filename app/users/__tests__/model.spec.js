const { Factory } = require('rosie')
const { expect } = require('chai')
const users = require('../')

describe('User Model', () => {
  it('can create a valid user', async () => {
    const user = users.Model(Factory.build('user'))
    const expected = await user.save()
    const actual = await users.Model.findOne(expected._id)
    expect(expected.toJSON()).to.be.eql(actual.toJSON())
  })

  describe('validation', () => {
    it('requires a name', () => {
      let user = users.Model({ name: '' })
      const { errors } = user.validateSync()
      expect(errors.name.message).to.be.equal('User name is required')
    })

    it('requires an email', () => {
      let user = users.Model({ email: '' })
      const { errors } = user.validateSync()
      expect(errors.email.message).to.be.equal('User email is required')
    })

    it('requires a valid email', () => {
      let user = users.Model({ email: 'invalid email' })
      const { errors } = user.validateSync()
      expect(errors.email.message).to.be.equal(
        'User email must be a valid email address'
      )
    })

    it('requires email to be unique', async () => {
      // Create a valid user with an email
      const email = 'foo@bar.com'
      const user = users.Model(Factory.build('user', { email }))
      const res = await user.save()
      expect(res.toJSON()).to.be.eql(user.toJSON())

      // Attempt to create another valid user with the same email
      try {
        const invalidUser = users.Model(Factory.build('user', { email }))
        await invalidUser.save()
      } catch ({ errors }) {
        expect(errors.email.message).to.be.equal('User email must be unique')
      }
    })
  })
})
