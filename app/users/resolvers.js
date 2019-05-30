const resolvers = {
  Query: {
    me: () => ({
      _id: '123',
      name: 'Diego Castillo',
      email: 'email@.foo.bar',
      picture: 'foo bar',
      createdAt: Date.now,
      updatedAt: Date.now
    })
  }
}

module.exports = {
  resolvers
}
