const mongoose = require('mongoose')

const recomendSchema = new mongoose.Schema({
    userid: {type: String, default: null},
    userid: {type: String, default: null},
    firstItem:{type: Number, default: null},
    secondItem:{type: Number, default: null},
    thirdItem:{type: Number, default: null}
})

module.exports = mongoose.model('recomends', recomendSchema)