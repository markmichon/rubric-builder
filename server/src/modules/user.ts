import { Schema, model } from 'mongoose'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { RubricSchema } from './rubric'
interface UserInteface {
  email: string
  password?: string
}

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

export const UserModel = model('User', UserSchema)

const generateJWT = (user: any) =>
  jwt.sign(
    {
      data: {
        _id: user._id,
        email: user.email,
      },
    },
    process.env.JWT_SECRET
  )

const getByToken = async (token: string) => {
  try {
    const { data } = jwt.verify(token, process.env.JWT_SECRET)
    const user = await UserModel.findById(data._id)
    if (user) {
      return user
    }
  } catch (err) {
    throw new Error('Could not validate user based on token')
  }
}
const login = async ({ email, password }) => {
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

const get = (userId: string) => UserModel.findById(userId)

export const User = {
  login,
  signup,
  getByToken,
  get,
}
