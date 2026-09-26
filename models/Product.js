const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  flavour: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  image: { type: DataTypes.STRING, defaultValue: '' },
  price: { type: DataTypes.FLOAT },
  size: { type: DataTypes.STRING },
  sizes: { type: DataTypes.JSONB } // stores the array of {size, price} options, like Greek Yoghurt
})

module.exports = Product