const express = require('express')
const ContactMessage = require('../models/ContactMessage')
const { verifyToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body
    const newMessage = await ContactMessage.create({ name, email, phone, message })
    res.status(201).json({ success: true, message: 'Message sent successfully', data: newMessage })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] })
    res.json({ success: true, message: 'Messages fetched successfully', data: messages })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router