const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    username: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    // phone : {type : String, default : null},
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: 'address' }],
    token: { type: String }
})

module.exports = mongoose.model('users', userSchema)