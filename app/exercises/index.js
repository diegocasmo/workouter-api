const { resolvers } = require('./resolvers')
const services = require('./services')
const { typeDef } = require('./type-def')
const Model = require('./model')

module.exports = {
  Model,
  resolvers,
  typeDef,
  services,
}
