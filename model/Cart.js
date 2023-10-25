const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    cartProducts: [{type : mongoose.Schema.Types.ObjectId, ref: 'CartProduct'} ]
}
);

module.exports = mongoose.model('Cart', CartSchema)