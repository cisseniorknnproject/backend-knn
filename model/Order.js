const mongoose = require('mongoose');

const OrderItemsSchema = new mongoose.Schema({
    ProductId : {type: mongoose.Schema.Types.ObjectId, ref: 'Product'}, 
    Quantity: {type: 'number', default: null},
})
const OrderSchema = new mongoose.Schema({
    Uid: {type:mongoose.Schema.Types.ObjectId, ref:'users'},
    OrderItem: [OrderItemsSchema],
    Date: {type: 'Date'},
    total: {type: 'number', default: null}
})
module.exports = mongoose.model('Order', OrderSchema)
