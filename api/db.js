const { connect } = require('mongoose')
const dbSetup = MONGO_URI => {
  return connect(
    MONGO_URI,
    { useNewUrlParser: true }
  )
}

module.exports.dbSetup = dbSetup
