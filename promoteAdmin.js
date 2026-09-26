require('dotenv').config()
const { sequelize } = require('./config/db')
const User = require('./models/User')

async function run() {
  await sequelize.authenticate()
  const email = process.argv[2]

  const user = await User.findOne({ where: { email } })
  if (!user) {
    console.log('No user found with that email')
    process.exit(1)
  }

  user.role = 'admin'
  await user.save()
  console.log(`${email} is now an admin`)
  process.exit(0)
}

run()