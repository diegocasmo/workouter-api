const { authenticated } = require('../middleware/authentication')
const mongoose = require('mongoose')
const {
  fetchExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
} = require('./services')

const resolvers = {
  Query: {
    fetchExercises: authenticated((root, { offset, limit }, { currentUser }) =>
      fetchExercises({
        author: currentUser._id,
        offset,
        limit,
      })
    ),
    getExercise: authenticated((root, { exerciseId }, { currentUser }) =>
      getExercise({
        exerciseId: mongoose.Types.ObjectId(exerciseId),
        author: currentUser._id,
      })
    ),
  },
  Mutation: {
    createExercise: authenticated((root, { name }, { currentUser }) =>
      createExercise({
        name,
        author: currentUser._id,
      })
    ),
    updateExercise: authenticated(
      (root, { exerciseId, name }, { currentUser }) =>
        updateExercise({
          exerciseId: mongoose.Types.ObjectId(exerciseId),
          name,
          author: currentUser._id,
        })
    ),
    deleteExercise: authenticated((root, { exerciseId }, { currentUser }) =>
      deleteExercise({
        exerciseId: mongoose.Types.ObjectId(exerciseId),
        author: currentUser._id,
      })
    ),
  },
}

module.exports = {
  resolvers,
}
