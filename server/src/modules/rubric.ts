import { Schema, model } from 'mongoose'
import merge from 'lodash/merge'
import { User } from './user'
const LevelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
})

const CriteriaSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false,
  },
})

const TopicSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  criteria: [CriteriaSchema],
})

export const RubricSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    levels: [LevelSchema],
    topics: [TopicSchema],
  },
  { timestamps: true }
)

const getAllByUserId = async userId => {
  const rubrics = await RubricModel.find({ owner: userId })
  if (rubrics) {
    return rubrics
  }
}

const getById = async id => {
  const rubric = await RubricModel.findById(id)
  if (rubric) {
    return rubric
  }
}

const create = (rubric: any) => RubricModel.create(rubric)

const update = async (rubric: any) => {
  let { id } = rubric
  let oldRubric = await RubricModel.findById(id)
  delete rubric._id
  let newRubric = merge(oldRubric, rubric)
  let { n, nModified, ok } = await RubricModel.replaceOne(
    { _id: id },
    newRubric
  )
  if (ok) {
    return true
  }
  return false
}
export const RubricModel = model('Rubric', RubricSchema)

export const Rubric = {
  getAllByUserId,
  getById,
  create,
  update,
}