require('dotenv').config()
require('../config/db')
const { connection } = require('mongoose')
const users = require('../app/users')
const exercises = require('../app/exercises')

// Make sure test suite only starts running once a DB connection
// has been established
before((done) => connection.once('open', done))

// Clean up all collections after each test
afterEach(async () => {
  return Promise.all([
    users.Model.deleteMany({}),
    exercises.Model.deleteMany({})
  ]).catch((err) => {
    if (err.name === 'MongoError' && err.message === 'ns not found') {
      // Everything is fine (the collection does not exist) - do nothing
    } else {
      throw new Error(err)
    }
  })
})
