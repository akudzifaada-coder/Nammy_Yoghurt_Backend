const express = require('express')
const Review = require('../models/Review')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.findAll({ order: [['createdAt', 'DESC']] })
    res.json({ success: true, message: 'Reviews fetched successfully', data: reviews })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const { customerName, rating, comment } = req.body
    const newReview = await Review.create({ customerName, rating, comment })
    res.status(201).json({ success: true, message: 'Review submitted successfully', data: newReview })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router