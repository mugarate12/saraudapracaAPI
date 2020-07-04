const express = require('express')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const { errors } = require('celebrate')
const bodyParser = require('body-parser')
require('dotenv').config()
const routes = require('./routes')
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

const app = express()

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Enconding'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}))
app.use(compression())
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())

app.use(routes)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use(errors())

module.exports = app
