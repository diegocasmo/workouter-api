const mongoose = require('mongoose')

const Exercise = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Exercise author is required'],
    immutable: true,
    ref: 'User'
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
