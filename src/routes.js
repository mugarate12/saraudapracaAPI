const { Router } = require('express')
const { celebrate, Segments, Joi } = require('celebrate')

const UserController = require('./controllers/userController')
const ParticipantController = require('./controllers/participantsController')

const routes = Router()

// users routes
routes.post('/users', celebrate({
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().required(),
    name: Joi.string().required()
  })
}), UserController.create)

// participants routes
routes.post('/participants', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    activity: Joi.string().required(),
    email: Joi.string().required(),
    num_phone: Joi.string().required()
  })
}), ParticipantController.create)

module.exports = routes
