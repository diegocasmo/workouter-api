const { resolvers } = require('./resolvers')
const { typeDef } = require('./type-def')
const User = require('./user')

module.exports = {
  User,
  resolvers,
  typeDef
}
