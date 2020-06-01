const bcrypt = require('bcryptjs')
const connection = require('./../database/connection')
const { createHashPassword } = require('./../utils/hashPassword')
const { handleError } = require('./../utils/errors')

const TABLE_NAME = 'users'

module.exports = {
  async create (req, res) {
    let { email, username, name, password } = req.body
    password = await createHashPassword(password)

    await connection(TABLE_NAME)
      .insert({
        email,
        username,
        password,
        name
      })
      .then(userID => res.status(201).json({ id: userID[0] }))
      .catch(error => handleError(error, res, 'username ou email já existem'))
  }
}
