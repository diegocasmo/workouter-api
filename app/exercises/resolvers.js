const { authenticated } = require('../middleware/auth')
const { getExercise, createExercise } = require('./services')
const mongoose = require('mongoose')

const resolvers = {
  Query: {
    getExercise: authenticated((root, { exerciseId }, { currentUser }) =>
      getExercise({
        exerciseId: mongoose.Types.ObjectId(exerciseId),
        userId: currentUser._id
      })
    )
  },
  Mutation: {
    createExercise: authenticated((root, { name }, { currentUser }) =>
      createExercise({
        name,
        userId: currentUser._id
      })
    )
  }
}

module.exports = {
  resolvers
}
