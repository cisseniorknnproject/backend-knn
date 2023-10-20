require('dotenv').config()
require('./config/database').connect()

const express = require('express')
const app = express()
const router = require('./routers/router')

app.use(express.json())
app.use(router)

module.exports = app