require('../../../test-utils/setup')
const { Factory } = require('rosie')
const { expect } = require('chai')
const sinon  = require('sinon')
const { authenticated } = require('../auth')

describe('Auth Middleware', () => {

  it('calls next if user is authenticated', () => {
    const ctx = { currentUser: Factory.build('user') }
    const next = sinon.spy()
    authenticated(next)(null, null, ctx)
    expect(next.calledOnce).to.be.true
  })

  it('throws an error if user is unauthenticated', () => {
    const ctx = { currentUser: null }
    const next = sinon.spy()
    try {
      authenticated(next)(null, null, ctx)
    } catch (err) {
      expect(err.message).to.be.equal('You must be logged in')
    }
  })
})
