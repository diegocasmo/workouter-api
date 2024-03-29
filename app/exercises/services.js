const ExerciseModel = require('./model')
const users = require('../users/')

// Fetch a paginated array of exercises sorted by ascending name
const fetchExercises = async ({ author, offset = 0, perPage = 12 }) =>
  ExerciseModel.aggregate()
    // Match user exercises' only
    .match({ author })
    // Create temp `lowerCaseName` attribute to sort exercises by
    .addFields({ lowerCaseName: { $toLower: '$name' } })
    .sort({ lowerCaseName: 1 })
    .project({ lowerCaseName: 0 })
    // Perform pagination
    .skip(offset)
    .limit(perPage)
    // Populate `author` (can't use Mongoose `populate` method with `aggregate`)
    .lookup({
      from: 'users',
      localField: 'author',
      foreignField: '_id',
      as: 'author',
    })
    .unwind('author')

// Find an exercise given its `_id` and `author`
const getExercise = async ({ exerciseId, author }) =>
  ExerciseModel.findOne({ _id: exerciseId, author }).populate('author')

// Create an exercise with the given attributes. Validates
// the exercise `author` exists
const createExercise = async ({ name, author }) => {
  const user = await users.services.findUserById(author)
  if (!user) {
    throw new Error('Exercise author does not exist')
  }

  const exercise = await ExerciseModel({ name, author }).save()
  return ExerciseModel.populate(exercise, 'author')
}

// Update an exercise attributes. Validates if the `author` is the
// owner of the exercise or not, throws an error if not
const updateExercise = async ({ exerciseId, author, ...attrs }) => {
  // Check exercise exists and author is the actual owner
  const exercise = await getExercise({ exerciseId, author })
  if (!exercise) {
    throw new Error('Exercise does not exist')
  }

  // Update exercise attributes
  exercise.set(attrs)

  return ExerciseModel.populate(exercise, 'author')
}

// Delete an exercise from DB. Validates if the `author` is the
// owner of the exercise or not, throws an error if not
const deleteExercise = async ({ exerciseId, author }) => {
  // Check exercise exists and author is the actual owner
  const exercise = await getExercise({ exerciseId, author })
  if (!exercise) {
    throw new Error('Exercise does not exist')
  }

  // Delete exercise
  exercise.delete()

  return ExerciseModel.populate(exercise, 'author')
}

module.exports = {
  fetchExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
}
