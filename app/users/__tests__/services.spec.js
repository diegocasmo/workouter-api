require('../../../test-utils/setup')
const { Factory } = require('rosie')
const { expect } = require('chai')
const { OAuth2Client } = require('google-auth-library')
const mongoose = require('mongoose')
const sinon = require('sinon')
const users = require('../')

describe('User Service', () => {

  describe('findUserByEmail', () => {

    it('returns a user if it exists', async () => {
      const expected = await users.Model(Factory.build('user')).save()
      const actual = await users.services.findUserByEmail(expected.email)
      expect(actual.toJSON()).to.be.eql(expected.toJSON())
    })

    it('returns null if no user exists', async () => {
      const res = await users.services.findUserByEmail('non-existent email')
      expect(res).to.be.null
    })
  })

  describe('findUserById', () => {

    it('returns a user if it exists', async () => {
      const expected = await users.Model(Factory.build('user')).save()
      const actual = await users.services.findUserById(expected._id)
      expect(actual.toJSON()).to.be.eql(expected.toJSON())
    })

    it('returns null if no user exists', async () => {
      const res = await users.services.findUserById(mongoose.Types.ObjectId())
      expect(res).to.be.null
    })
  })

  describe('findOrCreateAuthUser', () => {

    it('creates a new user if it doesn\'t exist', async () => {
      // Create a valid user in memory
      const user = Factory.build('user')
      let stub = sinon.stub(OAuth2Client.prototype, 'verifyIdToken').resolves({
        getPayload: () => ({
          name: user.name,
          email: user.email,
          picture: user.pictureUrl
        })
      })

      // No users in DB
      const allUsers = await users.Model.find()
      expect(allUsers.length).to.be.equal(0)

      // Verify authenticated user is created in DB
      const actual = await users.services.findOrCreateAuthUser('assume valid token')
      const expected = await users.Model.findOne({ email: user.email })
      expect(actual.toJSON()).to.be.eql(expected.toJSON())

      stub.restore()
    })

    it('returns existing user if one exists', async () => {
      // Create a valid user in DB
      const expected = await users.Model(Factory.build('user')).save()
      let stub = sinon.stub(OAuth2Client.prototype, 'verifyIdToken').resolves({
        getPayload: () => ({
          name: expected.name,
          email: expected.email,
          picture: expected.pictureUrl
        })
      })

      // Expect to find existing authenticated user
      const actual = await users.services.findOrCreateAuthUser('assume valid token')
      expect(actual.toJSON()).to.be.eql(expected.toJSON())

      stub.restore()
    })

    it('throws an error if unable to authenticate user', async () => {
      const errMsg = 'invalid token'
      // Assume token authentication failed
      let stub = sinon.stub(OAuth2Client.prototype, 'verifyIdToken').rejects(new Error(errMsg))

      try {
        // Expect Promise to throw an error
        await users.services.findOrCreateAuthUser('assume invalid token')
      } catch (err) {
        expect(err.message).to.be.equal(errMsg)
      }

      stub.restore()
    })
  })
})
