const mongoose = require('mongoose')

const productSchema =  new mongoose.Schema({
    name: {type : 'string', default: null},
    price: {type : 'number', default: null},
    description: {type :'string', default: null},
    image: {type :'string', default: null},
    category: {type :'string', default: null},
    stock: {type : 'number', default: null},
})

module.exports = mongoose.model('products', productSchema)