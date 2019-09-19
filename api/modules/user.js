// @ts-nocheck
const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { RubricSchema } = require('./rubric')

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    rubrics: [{ type: Schema.Types.ObjectId, ref: 'Rubric' }],
  },
  { timestamps: true }
)

const UserModel = model('User', UserSchema)

const generateJWT = user =>
  jwt.sign(
    {
      _id: user._id,
    },
    process.env.jwt_secret
  )

const getByToken = async token => {
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET)
    const user = await UserModel.findOne({ _id: _id })
    if (user) {
      return user
    }
  } catch (err) {
    return null
  }
}
const login = async ({ email, password }, { res }) => {
  const userRecord = await UserModel.findOne({ email })
  if (!userRecord) {
    throw new Error('Could not find user with that email')
  } else {
    const isValid = await bcrypt.compare(password, userRecord.password)
    if (!isValid) {
      throw new Error('Incorrect Password')
    }
  }
  const token = generateJWT(userRecord)
  // res.cookie('access-token', token, { expires: 60 * 60 * 24 * 7 })
  return {
    user: {
      email: userRecord.email,
    },
    token,
  }
}

const signup = async ({ email, password }) => {
  const existingUser = await UserModel.findOne({ email })
  if (existingUser) {
    throw new Error('User with that email already found')
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const userRecord = await UserModel.create({
    password: hashedPassword,
    email,
  })

  const token = generateJWT(userRecord)
  return {
    user: {
      email: userRecord.email,
    },
    token,
  }
}

const get = userId => UserModel.findById(userId)
module.exports.UserModel = UserModel
module.exports.User = {
  login,
  signup,
  getByToken,
  get,
}
