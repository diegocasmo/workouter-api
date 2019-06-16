const { authenticated } = require('../middleware/auth')

const resolvers = {
  Query: {
    currentUser: authenticated((root, args, ctx) => ctx.currentUser)
  }
}

module.exports = {
  resolvers
}
