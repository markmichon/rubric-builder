require('dotenv/config')
const { ApolloServer, gql } = require('apollo-server')
const { resolvers } = require('./resolvers')
const { typeDefs } = require('./typeDefs')
const { dbSetup } = require('./db')
const { User } = require('./modules/user')
// import { merge } from 'lodash'

const startServer = async () => {
  await dbSetup(process.env.MONGO_URI)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
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

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
}

startServer()
