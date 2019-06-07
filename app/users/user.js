const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required']
  },
  email: {
    type: String,
    required: [true, 'User email is required'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'User email in invalid']
  },
  pictureUrl: {
    type: String
  }
}, { timestamps: true })

module.exports = mongoose.model('User', UserSchema)
