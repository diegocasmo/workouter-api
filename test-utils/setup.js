require('dotenv').config()
require('../config/db')
require('../test-utils/factories')
const { connection } = require('mongoose')

// Make sure test suite only starts running once a DB connection
// has been established
before((done) => connection.once('open', done))

// Clean up all collections after each test
afterEach(() => {
  const { collections } = connection
  const collectionNames = Object.keys(collections).map(k => collections[k].name)
  return Promise.all(collectionNames.map((x) =>
    connection.collection(x).drop())
  ).catch((err) => {
    if (err.name === 'MongoError' && err.message === 'ns not found') {
      // Everything is fine (the collection does not exist) - do nothing
    } else {
      throw new Error(err)
    }
  })
})

// Close DB connection once the entire test suite has finished running
after((done) => connection.close(done))
