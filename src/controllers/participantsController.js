const connection = require('./../database/connection')
const { handleError } = require('./../utils/errors')

const TABLE_NAME = 'participants'

module.exports = {
  async create (req, res) {
    const { name, activity, email, num_phone, instagram } = req.body

    return await connection(TABLE_NAME)
      .insert({
        name,
        activity,
        email,
        num_phone,
        instagram
      })
      .then(participantID => res.status(201).json({ id: participantID[0] }))
      .catch(error => handleError(error, res, 'ocorreu um erro, verifique as informações por favor'))
  }
}
