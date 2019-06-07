require('../../../test-utils/setup')
const { Factory } = require('rosie')
const { expect } = require('chai')
const { User } = require('../')

describe('User Model', () => {

  it('can create a valid user', async () => {
    const user = User(Factory.build('user'))
    const res = await user.save()
    const record = await User.findOne(res._id)
    expect(res.toJSON()).to.be.eql(record.toJSON())
  })

  describe('validation', () => {

    it('requires a name', () => {
      let user = User({ name: '' })
      const { errors } = user.validateSync()
      expect(errors.name.message).to.be.equal('User name is required')
    })

    it('requires an email', () => {
      let user = User({ email: '' })
      const { errors } = user.validateSync()
      expect(errors.email.message).to.be.equal('User email is required')
    })

    it('requires a valid email', () => {
      let user = User({ email: 'invalid email' })
      const { errors } = user.validateSync()
      expect(errors.email.message).to.be.equal('User email in invalid')
    })
  })
})
