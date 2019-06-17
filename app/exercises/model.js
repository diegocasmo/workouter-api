const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Exercise = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required']
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Exercise user_id is required']
  },
}, { timestamps: true })

Exercise.plugin(uniqueValidator, { message: 'Exercise {PATH} must be unique' })

module.exports = mongoose.model('Exercise', Exercise)
