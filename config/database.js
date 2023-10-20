const mongoose = require('mongoose')

const { MONGO_URI } = process.env

exports.connect = () => {
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false
    })
    .then(() => {
        console.log('connect success')
    })
    .catch((error) => {
        console.log('connect error')
        console.error(error)
        process.exit(1)
    })
}