const { connection } = require('mongoose')

// Close DB connection once the entire test suite has finished running
after(done => connection.close(done))
