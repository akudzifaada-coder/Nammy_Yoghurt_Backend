const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')

const Order = sequelize.define('Order', {
  customerName: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  items: { type: DataTypes.JSONB, allowNull: false }, // array of {name, size, price, quantity}
  totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' } // pending / fulfilled
})

module.exports = Order