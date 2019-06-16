require('../../../server')
require('../../../test-utils/setup')
const { Factory } = require('rosie')
const { expect } = require('chai')
const sinon = require('sinon')
const { API_URL } = require('../../../test-utils/api-url')
const request = require('supertest')(API_URL)
const users = require('../')

describe('User Resolvers', () => {

  describe('currentUser', () => {

    const CURRENT_USER_QUERY = `
      {
        currentUser {
          _id
          name
          email
          pictureUrl
          createdAt
          updatedAt
        }
      }
    `

    it('returns current user if authenticated', async () => {
      const user = await users.Model(Factory.build('user')).save()
      const { __v, ...expected } = user.toJSON()
      sinon.stub(users.services, 'findOrCreateAuthUser').resolves(expected)

      const { body } = await request
        .post('/graphql')
        .set('authorization', 'assume valid token')
        .send({ query: CURRENT_USER_QUERY })
      const actual = body.data.currentUser

      expect(actual).to.be.eql({
        ...expected,
        _id: `${expected._id}`,
        createdAt: `${expected.createdAt.getTime()}`,
        updatedAt: `${expected.updatedAt.getTime()}`
      })

      users.services.findOrCreateAuthUser.restore()
    })

    it('requires authentication', async () => {
      const { body } = await request
        .post('/graphql')
        .send({ query: CURRENT_USER_QUERY })
      expect(body.data.currentUser).to.be.null
      expect(body.errors[0].message).to.be.equal('You must be logged in')
    })
  })
})
