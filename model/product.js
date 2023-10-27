const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name: { type: 'string', default: null },
    price: { type: 'number', default: null },
    category: { type: 'string', default: null },
    description: { type: 'string', default: null },
    image: { type: 'string', default: null },
    stock: { type: 'number', default: null },
    brand: { type: 'string', default: null },
    modelNumber: { type: 'number', default: null },
    cartProduct: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartProduct' }]
})

module.exports = mongoose.model('Product', ProductSchema)