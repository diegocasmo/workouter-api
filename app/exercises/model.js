const mongoose = require('mongoose')

const Exercise = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required']
  },
  user_id: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Exercise user_id is required']
  },
  createdAt: {
    type: Date,
    immutable: true
  },
  updatedAt: {
    type: Date,
    immutable: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Exercise', Exercise)
