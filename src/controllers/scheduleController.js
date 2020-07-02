const connection = require('./../database/connection')
const { handleError } = require('./../utils/errors')
const { validateHour } = require('./../utils/validators')
const sendEmail = require('./../utils/sendEmail')
const { createSchedule } = require('./../utils/createPDF')

const TABLE_NAME = 'schedule'

module.exports = {
  async create (req, res) {
    const { adminId } = req
    const { participants } = req.body

    if (!adminId) return res.status(401).json({ error: 'Operação não é permitida pra sua autorização' })
    participants.forEach(participant => {
      const validHour = validateHour(participant.hour)
      if (!validHour) return res.status(409).json({ error: 'Erro na incrição do participante', error: validHour.error })
    })

    return await connection(TABLE_NAME)
      .insert(participants)
      .then(scheduleId => res.status(201).json({ sucess: true }))
      .catch(error => handleError(error, res, 'Ocorreu um erro, por favor, tente novamente'))
  },
  async getSchedule (req, res) {
    const { adminId } = req
    let { id } = req.params

    if (!adminId) return res.status(401).json({ error: 'Operação não é permitida pra sua autorização' })

    return await connection(TABLE_NAME)
      .join('participants', `${TABLE_NAME}.participantIDFK`, '=', 'participants.id')
      .select('participants.id', `${TABLE_NAME}.hour`, 'participants.name')
      .where(`${TABLE_NAME}.eventIDFK`, Number(id))
      .then(participants => res.status(200).json({ 
        schedule: { participants }
      }))
      .catch(error => handleError(error, res, 'Ocorreu um erro'))
  },
  async sendSchedule (req, res) {
    const { adminId } = req
    let { id } = req.params

    if (!adminId) return res.status(401).json({ error: 'Operação não é permitida pra sua autorização' })

    // email dos participants
    return await connection(TABLE_NAME)
    .join('participants', `${TABLE_NAME}.participantIDFK`, '=', 'participants.id')
    .join('event', `${TABLE_NAME}.eventIDFK`, '=', 'event.id')
    .select('participants.email', {participantName: 'participants.name'}, {eventName: 'event.name'}, `${TABLE_NAME}.hour`)
    .where(`${TABLE_NAME}.eventIDFK`, Number(id))
    .orderBy(`${TABLE_NAME}.hour`)
    .then(async (participants) => {
      const adminEmails = await connection('admins')
        .select('email')

      let emails = []
      participants.forEach(participant => {
        if (!emails.includes(participant.email)) {
          emails.push(participant.email)
        }
        
      })
      adminEmails.forEach(admin => {
        if (!emails.includes(admin.email)) {
          emails.push(admin.email)
        }
      })

      const pdfName = createSchedule(participants)
      await sendEmail({
        email: [...emails],
        title: `Cronograma do ${participants[0].eventName}`,
        content: `
          Estamos te enviando o cronograma em anexo

          Caso precise entrar em contato conosco: (XX)XXXXX-XXXX, ou nosso email XXXXXXXX@gmail.com

          A Poesia Prevalece!
        `,
        pdfName
      })
      .then(response => res.status(200).json({ sucess: true }))
      .catch(error => handleError(error, res, 'Ocorreu um erro no envio dos emails, por favor, tente novamente'))
    })
    .catch(error => handleError(error, res, 'Ocorreu um erro, tente novamente'))
  },
  async updateSchedule (req, res) {
    const { adminId } = req
    let { id } = req.params
    let { participants } = req.body

    if (!adminId) return res.status(401).json({ error: 'Operação não é permitida pra sua autorização' })
    participants.forEach(participant => {
      const validHour = validateHour(participant.hour)
      if (!validHour) return res.status(409).json({ error: 'Erro na incrição do participante', error: validHour.error })
    })

    // caso ele consiga excluir os registros mas não registrar, vou colocar a informação novamente no banco
    const participantsInDatabase = await connection(TABLE_NAME)
      .select('hour', 'eventIDFK', 'participantIDFK')
      .where({
        eventIDFK: Number(id)
      })
    
    return await connection(TABLE_NAME)
      .where({
        eventIDFK: Number(id)
      })
      .del()
      .then(async (scheduleId) => {
        let insertParticipants = []
        participants.forEach(participant => {
          insertParticipants.push({
            eventIDFK: id,
            hour: participant.hour,
            participantIDFK: participant.id
          })
        })

        return await connection(TABLE_NAME)
          .insert(insertParticipants)
          .then(scheduleId => res.status(200).json({ sucess: true }))
          .catch(async (error) => {
            // caso não consiga inserir os novos participants, onde esses são apenas os mesmos atualizados, reinsere a informação antigo
            // e lança um erro pra que seja verificada as informações dos participants
            return await connection(TABLE_NAME)
              .insert(participantsInDatabase)
              .then(scheduleId => handleError(new Error('Generico'), res, 'Erro na informação dos participantes'))
          })
      })
      .catch(error => handleError(error, res, 'Ocorreu um erro, verifique a informação do id do Evento'))
  }
}
