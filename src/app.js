const express = require('express')
const cors = require('cors')
const { errors } = require('celebrate')
const bodyParser = require('body-parser')
require('dotenv').config()
const routes = require('./routes')
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

app.use(routes)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use(errors())

module.exports = app
