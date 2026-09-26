const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Review = sequelize.define('Review', {
  customerName: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false }, // 1-5
  comment: { type: DataTypes.TEXT, allowNull: false }
})

module.exports = Review