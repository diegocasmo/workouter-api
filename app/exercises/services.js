const ExerciseModel = require('./model')
const users = require('../users/')

// Find an exercise given its `_id` and `user_id`
const getExercise = async ({ exerciseId, userId }) => (
  ExerciseModel.findOne({ _id: exerciseId, user_id: userId })
)

// Create an exercise with the given attributes. Validates
// the exercise `user_id` exists
const createExercise = async ({ name, userId }) => {
  const user = await users.services.findUserById(userId)
  if (user) {
    return ExerciseModel({ name, user_id: userId }).save()
  } else {
    throw new Error('Exercise user_id does not exist')
  }
}

module.exports = {
  getExercise,
  createExercise
}
