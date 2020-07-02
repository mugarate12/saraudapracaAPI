const connection = require('./../database/connection')
const { handleError } = require('./../utils/errors')
const { validateEventDate } = require('./../utils/validators')

const TABLE_NAME = 'event'
const PARTICIPANTS_TABLE_NAME = 'participants'

module.exports = {
  async create (req, res) {
    const { adminId } = req
    const { name, date } = req.body

    if (!adminId) return res.status(401).json({ error: 'Operação não é permitida pra sua autorização' })
    const validDate = validateEventDate(date)
    if (!validDate.valid) return res.status(409).json({ error: 'Data inválida', message: validDate.error })

    return await connection(TABLE_NAME)
      .insert({
        name,
        date
      })
      .then(eventId => res.status(201).json({ sucess: true }))
      .catch(error => handleError(error, res, 'não foi possivel cadastrar evento'))
  },
  async indexEvent (req, res) {
    const date = new Date()

    return await connection(TABLE_NAME)
      .select('name', 'date')
      .then(events => {
        let validEvents = []
        events.forEach(eventObject => {
          const eventDate = eventObject.date.split('T')[0].split('-')
          const eventYear = eventDate[0]
          const eventMonth = eventDate[1]
          const eventDay = eventDate[2]

          if (date.getFullYear() > eventYear) return
          if (date.getFullYear() === eventYear && (date.getMonth() + 1) > eventMonth) return
          if (date.getFullYear() === eventYear && (date.getMonth() + 1) === eventMonth && date.getDate() > eventDay) return

          validEvents.push(eventObject)
        })

        return res.status(200).json({ events: validEvents })
      })
      .catch(error => handleError(error, res, 'Erro inexperado'))
  },
  async index (req, res) {
    const { adminId } = req
    if (!adminId) return res.status(401).json({ error: 'Operação não é permitida pra sua autorização' })

    return await connection(TABLE_NAME)
      .select('*')
      .orderBy('date')
      .then(events => res.status(200).json({ events }))
      .catch(error => handleError(error, res, 'Ocorreu um erro, por favor, tente novamente'))
  },
  async indexParticipants (req, res) {
    const { adminId } = req
    let { id } = req.params

    if (!adminId) return res.status(401).json({ error: 'Operação não é permitida pra sua autorização' })

    return await connection(PARTICIPANTS_TABLE_NAME)
      .select('id', 'name', 'email', 'activity', 'num_phone', 'instagram')
      .where({
        eventIDFK: Number(id)
      })
      .then(participants => res.status(200).json({ participants }))
      .catch(error => handleError(error, res, 'Ocorreu um erro, verifique os dados e tente novamente'))
  },
  async updateDate (req, res) {
    const { adminId } = req
    let { id } = req.params
    const { date } = req.body

    if (!adminId) return res.status(401).json({ error: 'Operação não é permitida pra sua autorização' })
    const validDate = validateEventDate(date)
    if (!validDate.valid) return res.status(409).json({ error: 'Data inválida', message: validDate.error })
    
    return await connection(TABLE_NAME)
      .where({
        id: Number(id)
      })
      .update({
        date
      })
      .then(eventId => res.status(200).json({ sucess: true }))
      .catch(error => handleError(error, res, 'Ocorreu um erro, verifique as informações'))
  },
  async updateName (req, res) {
    const { adminId } = req
    let { id } = req.params
    const { name } = req.body

    if (!adminId) return res.status(401).json({ error: 'Operação não é permitida pra sua autorização' })

    return await connection(TABLE_NAME)
      .where({
        id: Number(id)
      })
      .update({
        name
      })
      .then(eventId => res.status(200).json({ sucess: true }))
      .catch(error =>  handleError(error, res, 'Ocorreu um erro, por favor, verifique as informações das credenciais e nome do evento'))
  }
}
