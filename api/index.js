require('dotenv/config')
const { ApolloServer, gql } = require('apollo-server-micro')
const { resolvers } = require('./resolvers')
const { typeDefs } = require('./typeDefs')
const { dbSetup } = require('./db')
const { User } = require('./modules/user')
// import { merge } from 'lodash'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    await dbSetup(process.env.mongo_uri)
    const token = req.headers.authorization || ''
    try {
      const user = await User.getByToken(token)
      if (user) {
        return { user, token }
      }
    } catch (err) {
      console.log(err)
    }
  },
})

module.exports = server.createHandler({ path: '/api' })
