import { User } from './modules/user'

export const resolvers = {
  Query: {
    getMe: (parent: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not logged in')
      }
      return { email: context.user.email }
    },
    login: async (parent: any, args: any, context: any) => {
      const user = await User.login(args)
      return user
    },
  },
  Mutation: {
    signup: async (parent: any, args: any, context: any) => {
      const user = await User.signup(args)
      if (!user) {
        throw new Error('Failed to create user')
      }
      return user
    },
  },
}
