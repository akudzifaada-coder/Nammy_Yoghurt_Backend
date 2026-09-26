const express = require('express')
const Order = require('../models/Order')
const { verifyToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

// Anyone (guest checkout) can PLACE an order
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, address, items, totalPrice } = req.body
    const newOrder = await Order.create({ customerName, phone, address, items, totalPrice })
    res.status(201).json({ success: true, message: 'Order placed successfully', data: newOrder })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Only admins can VIEW all orders (this is business data, not public)
router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] })
    res.json({ success: true, message: 'Orders fetched successfully', data: orders })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.patch('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id)
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' })
    }
    order.status = req.body.status
    await order.save()
    res.json({ success: true, message: 'Order updated', data: order })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router