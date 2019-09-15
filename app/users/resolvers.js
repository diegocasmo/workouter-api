const { authenticated } = require('../middleware/authentication')

const resolvers = {
  Query: {
    currentUser: authenticated((root, args, { currentUser }) => currentUser),
  },
}

module.exports = {
  resolvers,
}
