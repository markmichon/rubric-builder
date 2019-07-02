import { User } from './modules/user'
import { Rubric } from './modules/rubric'
export const resolvers = {
  Query: {
    me: async (parent: any, args: any, { token }) => {
      const user = await User.getByToken(token)
      if (!user || !token) {
        throw new Error('Not logged in')
      }
      return { email: user.email }
    },
    rubrics: async (parent: any, args: any, { token }) => {
      // 1. Check if user is logged in
      const user = await User.getByToken(token)
      if (!user) {
        throw new Error('You must be logged in to view rubrics')
      }
      // 2. Query Rubrics that belong to user
      const rubrics = await Rubric.getAllByUserId(user._id)

      if (!rubrics) {
        throw new Error('no rubrics found for that user')
      }
      // 3. Return array of Rubrics
      return rubrics
    },
    rubric: async (parent: any, { id }, { token }) => {
      // 1. Check if user is logged in
      const user = await User.getByToken(token)
      // 2. Get Rubric by ID and confirm it belongs to user
      const rubric = await Rubric.getById(id)
      if (rubric.owner.toString() !== user._id.toString()) {
        throw new Error('You do not have permission to view this rubric')
      }
      // 3. Return Rubric
      return rubric
    },
  },
  Mutation: {
    login: async (parent: any, args: any, context: any) => {
      const userPayload = await User.login(args, context)
      return userPayload
    },
    signup: async (parent: any, args: any, context: any) => {
      const userPayload = await User.signup(args)
      if (!userPayload) {
        throw new Error('Failed to create user')
      }
      return userPayload
    },
    saveRubric: async (parent: any, { rubric }, { token }) => {
      const user = await User.getByToken(token)
      if (!user) {
        throw new Error('Cannot create rubric unless logged in')
      }

      if (!rubric.id) {
        const rubricWithOwner = {
          ...rubric,
          owner: user._id,
        }
        const addedRubric = await Rubric.create(rubricWithOwner)
        if (addedRubric) {
          return { success: true }
        }
        return { success: false }
      }
      const success = await Rubric.update(rubric)
      if (!success) {
        throw new Error('Failed to update Rubric')
      }
      return { success: true }
    },
    updateRubric: async (parent: any, { rubric }, { token }) => {
      const user = await User.getByToken(token)
      if (!user) {
        throw new Error('Cannot create rubric unless logged in')
      }
      const success = await Rubric.update(rubric)
      if (!success) {
        throw new Error('Failed to update Rubric')
      }
      return { success }
    },
  },
}
