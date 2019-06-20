import 'dotenv/config'
import { ApolloServer, gql } from 'apollo-server'
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'
import { dbSetup } from './db'
import { User } from './modules/user'
// import { merge } from 'lodash'

const startServer = async () => {
  await dbSetup(process.env.MONGO_URI)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }: any) => {
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
