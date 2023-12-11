const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    Street: String,
    State: String,
    City: String,
    ZipCode: String,
    Country: String,
    InformationId: { type: mongoose.Schema.Types.ObjectId, ref:'uinfo', default: null },
})


module.exports = mongoose.model('Address', AddressSchema);