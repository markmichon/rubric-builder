process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const env = process.env.NODE_ENV

const baseConfig = {
  port: 3000,
  secrets: {
    JWT_SECRET: 'devEnvironmentSecret',
  },
  db: {
    url: 'mongodb://localhost:27017/rubric',
  },
}

// eventually switch depending on environment

export default baseConfig
