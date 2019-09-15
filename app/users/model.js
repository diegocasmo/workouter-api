const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User name is required'],
    },
    email: {
      unique: true,
      uniqueCaseInsensitive: true,
      index: true,
      type: String,
      required: [true, 'User email is required'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'User email must be a valid email address',
      ],
    },
    pictureUrl: {
      type: String,
    },
    createdAt: {
      type: Date,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      immutable: true,
    },
  },
  { timestamps: true }
)

UserSchema.plugin(uniqueValidator, { message: 'User {PATH} must be unique' })

module.exports = mongoose.model('User', UserSchema)
