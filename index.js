require('dotenv').config()
require('./config/db')
const { constructServer } = require('./apollo-server')

const { server } = constructServer({})

const port = process.env.PORT || 8080
const host = process.env.HOST || '0.0.0.0'

server.listen(port, host)
  .then(({ url }) => console.log(`Server listening on ${url}`))
  .catch((err) => console.error('Failed to start application', err))
