const { Router } = require('express')
const { celebrate, Segments, Joi } = require('celebrate')
const passport = require('passport')

const UserController = require('./controllers/userController')
const ParticipantController = require('./controllers/participantsController')
const authGoogleController = require('./controllers/authgoogleController')

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

// auth google routes
routes.get('/auth/failed', authGoogleController.authFailed)
routes.get('/auth/sucess', authGoogleController.authSucess)
routes.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
routes.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/failed' }),
  (req, res) => {
    res.redirect('/auth/sucess')
  }
)

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
