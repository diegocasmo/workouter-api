const mongoose = require('mongoose')
const { isProduction, isDevelopment, isTest } = require('./environment')

// Connect to Mongo URI according to current environment
const { MONGO_PROD_URI, MONGO_DEV_URI, MONGO_TEST_URI } = process.env
const mongoURI = isProduction()
  ? MONGO_PROD_URI
  : isDevelopment()
  ? MONGO_DEV_URI
  : MONGO_TEST_URI

mongoose
  .connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err))
