const { parseISO } = require('date-fns')
const { zonedTimeToUtc } = require('date-fns-tz')
const connection = require('./../database/connection')
const { handleError } = require('./../utils/errors')
const sendEmail = require('./../utils/sendEmail')

const TABLE_NAME = 'participants'
const EVENT_TABLE_NAME = 'event'

module.exports = {
  async create (req, res) {
    const { name, activity, email, num_phone, instagram } = req.body
    
    const date = new Date()
    const formatedDate = `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate().toString().length == 1 ? `0${date.getDate()}` : date.getDate()} 00:00:00`
    const parsedDate = parseISO(formatedDate)
    const znDate = zonedTimeToUtc(parsedDate, 'America/Sao_Paulo')
    
    const events = await connection(EVENT_TABLE_NAME)
      .select('id', 'name')
      .where('date', '>', znDate)
      .orderBy('date')
    
    if (!events[0]) return res.status(409).json({ error: 'Ação impossivel', message: 'Não há eventos disponiveis para participar' })

    return await connection(TABLE_NAME)
      .insert({
        name,
        activity,
        email,
        num_phone,
        instagram,
        eventIDFK: events[0].id
      })
      .then(async (participantID) => {
        return await sendEmail({
          email,
          title: 'Olá, artista!',
          content: `
            ${name}, você acaba de fazer o cadastro no fabuloso evento que irá ocorrer na sua cidade!
            Assim que fizermos o cronograma, te enviaremos outro email com um PDF com ele, ta?

            Caso precise entrar em contato conosco: (XX)XXXXX-XXXX, ou nosso email XXXXXXXX@gmail.com

            A Poesia Prevalece!
          `
        })
        .then(response => res.status(201).json({ id: participantID[0] }))
        .catch(error => handleError(error, res, 'Erro ao mandar email'))
      })
      .catch(error => handleError(error, res, 'ocorreu um erro, verifique as informações por favor'))
  }
}
