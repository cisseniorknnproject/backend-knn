const mongoose = require('mongoose')
const Product = require('./product')


const CartProductSchema = new mongoose.Schema({
    CartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    ProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: number, default: 0 }
})

module.exprot = mongoose.model('CartProduct', CartProductSchema)