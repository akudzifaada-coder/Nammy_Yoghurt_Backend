const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
})

async function connectDB() {
  try {
    await sequelize.authenticate()
    console.log('PostgreSQL connected successfully')
  } catch (error) {
    console.error('PostgreSQL connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = { sequelize, connectDB }