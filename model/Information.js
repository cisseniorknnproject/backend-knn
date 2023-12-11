const mongoose = require('mongoose')

const UserInfoSchema = new mongoose.Schema({
    addressId:{ type: mongoose.Schema.Types.ObjectId, unique: true },
    Phone: { type: 'String', default: null },
    Birthday: { type: 'Date', default: null },
    Active: { type: 'number', default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})

module.exports = mongoose.model('uinfo', UserInfoSchema)