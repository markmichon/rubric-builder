const { connect } = require('mongoose')
const connectionURL = `mongodb://localhost/rubrics`

const dbSetup = (MONGO_URI = connectionURL) => {
  return connect(
    MONGO_URI,
    { useNewUrlParser: true }
  )
}

module.exports.dbSetup = dbSetup
