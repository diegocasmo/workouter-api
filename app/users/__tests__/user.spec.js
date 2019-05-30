const { expect } = require('chai')
const { User } = require('../')

describe('User Model', () => {

  describe('validation', () => {

    it('requires a name', async () => {
      try {
        let u = User({name: ''})
        await u.validate()
        throw new Error("User 'name' must be required") // force catch to be executed
      } catch ({ errors }) {
        expect(errors).to.have.property('name')
      }
    })

    it('requires an email', async () => {
      try {
        let u = User({name: 'Foo bar', email: ''})
        await u.validate()
        throw new Error("User 'email' must be required") // force catch to be executed
      } catch ({ errors }) {
        expect(errors).to.have.property('email')
      }
    })
  })
})
