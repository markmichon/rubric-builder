// @ts-nocheck
const { Schema, model } = require('mongoose')
const merge = require('lodash/merge')
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
    default: '',
  },
  disabled: {
    type: Boolean,
    required: true,
    default: false,
  },
  levelName: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
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

const RubricSchema = new Schema(
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
  const rubrics = await RubricModel.find({ owner: userId }).sort({
    updatedAt: 'desc',
  })
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

const create = rubric => RubricModel.create(rubric)

const update = async rubric => {
  let { id } = rubric
  let oldRubric = await RubricModel.findById(id)
  delete rubric._id
  let newRubric = merge(oldRubric, rubric)
  newRubric.updatedAt = Date.now()
  let { ok } = await RubricModel.updateOne({ _id: id }, newRubric)
  if (ok) {
    return true
  }
  return false
}

const remove = async id => RubricModel.findByIdAndDelete(id)

const getOwner = async id => {
  let rubric = await RubricModel.findById(id)
  if (rubric.owner) return rubric.owner
  throw new Error('Could not get owner for rubric')
}

// const isOwner = async (rubricId, ownerId) => {

// }

const RubricModel = model('Rubric', RubricSchema)
module.exports.RubricModel = RubricModel
module.exports.Rubric = {
  getAllByUserId,
  getById,
  create,
  update,
  remove,
  getOwner,
}
