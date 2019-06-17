const { authenticated } = require('../middleware/auth')

const resolvers = {
  Query: {
    currentUser: authenticated((root, args, { currentUser }) => currentUser)
  }
}

module.exports = {
  resolvers
}
