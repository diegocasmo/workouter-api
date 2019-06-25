const { authenticated } = require('../middleware/authentication')
const { getExercise, createExercise, updateExercise } = require('./services')
const mongoose = require('mongoose')

const resolvers = {
  Query: {
    getExercise: authenticated((root, { exerciseId }, { currentUser }) =>
      getExercise({
        exerciseId: mongoose.Types.ObjectId(exerciseId),
        author: currentUser._id
      })
    )
  },
  Mutation: {
    createExercise: authenticated((root, { name }, { currentUser }) =>
      createExercise({
        name,
        author: currentUser._id
      })
    ),
    updateExercise: authenticated((root, { exerciseId, name }, { currentUser }) =>
      updateExercise({
        exerciseId: mongoose.Types.ObjectId(exerciseId),
        name,
        author: currentUser._id
      })
    )
  }
}

module.exports = {
  resolvers
}
