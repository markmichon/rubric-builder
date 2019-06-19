import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
interface UserInteface {
  email: string
  password?: string
}

const UserSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
)

export const UserModel = mongoose.model('User', UserSchema)

const generateJWT = (user: any) =>
  jwt.sign(
    {
      data: {
        _id: user._id,
        email: user.email,
      },
    },
    process.env.JWT_SECRET,
    { expiresIn: '6h' }
  )

const getByToken = async (token: string) => {
  try {
    const { data } = jwt.verify(token, process.env.JWT_SECRET)
    const user = await UserModel.findById(data._id)
    if (user) {
      return user
    }
  } catch (err) {
    return false
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

export const User = {
  login,
  signup,
  getByToken,
}
