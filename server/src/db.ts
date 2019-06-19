import { connect } from 'mongoose'
const connectionURL: string = `mongodb://localhost/rubrics`

export const dbSetup: any = (MONGO_URI: string = connectionURL) => {
  return connect(
    MONGO_URI,
    { useNewUrlParser: true }
  )
}
