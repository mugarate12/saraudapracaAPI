const { Router } = require('express')
const { celebrate, Segments, Joi } = require('celebrate')
const authJWT = require('./middlewares/authJWT')

const ParticipantController = require('./controllers/participantsController')
const adminsController = require('./controllers/adminController')
const sessionController = require('./controllers/sessionController')
const eventController = require('./controllers/eventController')
const scheduleController = require('./controllers/scheduleController')

const routes = Router()

// admin routes
routes.post('/admin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    username: Joi.string().required(),
    name: Joi.string().required(),
    password: Joi.string().required()
  })
}), authJWT, adminsController.create)

routes.put('/admin/password', celebrate({
  [Segments.BODY]: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required()
  })
}), authJWT, adminsController.updatePassword)
routes.put('/admin/username', celebrate({
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().required()
  })
}), authJWT, adminsController.updateUsername)
routes.put('/admin/name', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required()
  })
}), authJWT, adminsController.updateName)
routes.put('/admin/email', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email()
  })
}), authJWT, adminsController.updateEmail)

// participants routes
routes.post('/participants', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    activity: Joi.string().required(),
    email: Joi.string().required().email(),
    num_phone: Joi.string().required(),
    instagram: Joi.string().required()
  })
}), ParticipantController.create)

// session routes
routes.post('/auth/admin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().optional().email(),
    username: Joi.string().optional(),
    password: Joi.string().required()
  })
}), sessionController.loginAdmin)

// event routes 
routes.post('/event', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    date: Joi.string().required()
  })
}), authJWT, eventController.create)
routes.get('/event', authJWT, eventController.index)
routes.get('/event/valid', eventController.indexEvent)
routes.get('/event/:id/participats', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required()
  })
}), authJWT, eventController.indexParticipants)
routes.put('/event/:id/date', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required()
  }),
  [Segments.BODY]: Joi.object().keys({
    date: Joi.string().required()
  })
}), authJWT, eventController.updateDate)
routes.put('/event/:id/name', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required()
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required()
  })
}), authJWT, eventController.updateName)

// schedule routes (admin acess)
routes.post('/schedule', celebrate({
  [Segments.BODY]: Joi.object().keys({
    participants: Joi.array().items(Joi.object().keys({
      hour: Joi.string().required(),
      eventIDFK: Joi.number().required(),
      participantIDFK: Joi.number().required()
    }))
  })
}), authJWT, scheduleController.create)
routes.get('/events/:id/schedule', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required()
  })
}), authJWT, scheduleController.getSchedule)
routes.put('/events/:id/schedule', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required()
  }),
  [Segments.BODY]: Joi.object().keys({
    participants: Joi.array().items(Joi.object().keys({
      id: Joi.number().required(),
      hour: Joi.string().required(),
      name: Joi.string().required()
    }))
  })
}), authJWT, scheduleController.updateSchedule)
routes.get('/events/:id/schedule/send', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required()
  })
}), authJWT, scheduleController.sendSchedule)

module.exports = routes
