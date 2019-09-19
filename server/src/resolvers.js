const { User } = require('./modules/user')
const { Rubric, RubricModel } = require('./modules/rubric')
const { GraphQLDateTime } = require('graphql-iso-date')
const resolvers = {
  Query: {
    // @ts-ignore
    me: async (parent, args, { token }) => {
      const user = await User.getByToken(token)
      if (!user || !token) {
        throw new Error('Not logged in')
      }
      // @ts-ignore
      return { email: user.email }
    },
    // @ts-ignore
    rubrics: async (parent, args, { token }) => {
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
    // @ts-ignore
    rubric: async (parent, { id }, { token }) => {
      // 1. Check if user is logged in
      const user = await User.getByToken(token)
      // 2. Get Rubric by ID and confirm it belongs to user
      const rubric = await Rubric.getById(id)
      // @ts-ignore
      if (rubric.owner.toString() !== user._id.toString()) {
        throw new Error('You do not have permission to view this rubric')
      }
      // 3. Return Rubric
      return rubric
    },
  },
  Mutation: {
    // @ts-ignore
    login: async (parent, args, context) => {
      const userPayload = await User.login(args, context)
      return userPayload
    },
    // @ts-ignore
    signup: async (parent, args, context) => {
      const userPayload = await User.signup(args)
      if (!userPayload) {
        throw new Error('Failed to create user')
      }
      return userPayload
    },
    // @ts-ignore
    saveRubric: async (parent, { rubric }, { token }) => {
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
      // TODO: Add logic to ensure only owner can update a rubric
      const success = await Rubric.update(rubric)
      if (!success) {
        throw new Error('Failed to update Rubric')
      }
      return { success: true }
    },
    // @ts-ignore
    updateRubric: async (parent, { rubric }, { token }) => {
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
    // @ts-ignore
    deleteRubric: async (parent, { id }, { token }) => {
      const user = await User.getByToken(token)
      if (!user) {
        throw new Error('Cannot create rubric unless logged in')
      }
      let rubricOwner = await Rubric.getOwner(id)
      console.log(rubricOwner)
      if (rubricOwner.toString() === user._id.toString()) {
        try {
          let res = await RubricModel.findByIdAndDelete(id)
          if (res) {
            return { success: true }
          }
        } catch (error) {
          throw new Error(error)
        }
      } else {
        throw new Error('User does not own rubric')
      }
    },
  },
  Date: GraphQLDateTime,
}

module.exports.resolvers = resolvers
