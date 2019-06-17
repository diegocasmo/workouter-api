require('../../../test-utils/setup')
const { constructServer } = require('../../../apollo-server')
const { createTestClient } = require('apollo-server-testing')
const { Factory } = require('rosie')
const { expect } = require('chai')
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

      // Assume expected user is authenticated
      const { server } = constructServer({
        context: () => ({ currentUser: expected })
      })

      const { query } = createTestClient(server)
      const { data } = await query({
        query: CURRENT_USER_QUERY
      })

      expect(data.currentUser).to.be.eql({
        ...expected,
        _id: `${expected._id}`,
        createdAt: `${expected.createdAt.getTime()}`,
        updatedAt: `${expected.updatedAt.getTime()}`
      })
    })

    it('requires authentication', async () => {
      // Assume there is no user authenticated
      const { server } = constructServer({})

      const { query } = createTestClient(server)
      const { data, errors } = await query({
        query: CURRENT_USER_QUERY
      })

      expect(data.currentUser).to.be.null
      expect(errors[0].message).to.be.equal('You must be logged in')
    })
  })
})
