const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { connectDB, sequelize } = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const orderRoutes = require('./routes/orderRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const contactRoutes = require('./routes/contactRoutes')

const app = express()

app.use(cors())
app.use(express.json())

async function start() {
  await connectDB()
  await sequelize.sync()
  console.log('Database tables synced')
}
start()

app.get('/', (req, res) => {
  res.json({ message: 'Nammy Yoghurt API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/contact', contactRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})