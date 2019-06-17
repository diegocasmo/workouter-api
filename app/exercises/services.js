const ExerciseModel = require('./model')

// Find an exercise given its `_id` and `user_id`
const getExercise = async ({ exerciseId, userId }) => (
  ExerciseModel.findOne({ _id: exerciseId, user_id: userId })
)

module.exports = {
  getExercise
}
