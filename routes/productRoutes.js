const express = require('express')
const Product = require('../models/Product')
const { verifyToken, requireAdmin } = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll()
    res.json({ success: true, message: 'Products fetched successfully', data: products })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    res.json({ success: true, message: 'Product fetched successfully', data: product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Only logged-in admins can add, edit, or remove products
router.post('/', verifyToken, requireAdmin, async (req, res) => {
  try {
    const newProduct = await Product.create(req.body)
    res.status(201).json({ success: true, message: 'Product created successfully', data: newProduct })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.put('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    await product.update(req.body)
    res.json({ success: true, message: 'Product updated successfully', data: product })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }
    await product.destroy()
    res.json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

module.exports = router