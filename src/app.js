const express = require('express')
const cors = require('cors')
const { errors } = require('celebrate')
const bodyParser = require('body-parser')
const passport = require('passport')
const cookieSession = require('cookie-session')
require('dotenv').config()
require('./config/passportAuthGoogle')
const routes = require('./routes')
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieSession({
  name: 'test-session',
  keys: ['key1', 'key2']
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(routes)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
app.use(errors())

module.exports = app
