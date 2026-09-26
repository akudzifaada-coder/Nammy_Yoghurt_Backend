const express = require('express')
const Order = require('../models/Order')

const router = express.Router()

// POST /api/payments/initialize — start a payment with Paystack
router.post('/initialize', async (req, res) => {
  try {
    const { email, amount, customerName, phone, address, items } = req.body

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Paystack expects the smallest currency unit (pesewas)
        callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
        metadata: { customerName, phone, address, items }
      })
    })

    const data = await response.json()

    if (!data.status) {
      return res.status(400).json({ success: false, message: data.message })
    }

    res.json({
      success: true,
      message: 'Payment initialized',
      data: {
        authorizationUrl: data.data.authorization_url,
        reference: data.data.reference
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/payments/verify/:reference — confirm payment succeeded, then save the order
router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
    })

    const data = await response.json()

    if (!data.status || data.data.status !== 'success') {
      return res.status(400).json({ success: false, message: 'Payment was not successful' })
    }

    const { customerName, phone, address, items } = data.data.metadata
    const totalPrice = data.data.amount / 100 // convert back from pesewas

    const newOrder = await Order.create({
      customerName,
      phone,
      address,
      items,
      totalPrice,
      status: 'pending'
    })

    res.json({
      success: true,
      message: 'Payment verified and order placed',
      data: newOrder
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router