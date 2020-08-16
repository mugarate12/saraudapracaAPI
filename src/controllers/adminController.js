const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const connection = require('./../database/connection')
const { createHashPassword } = require('./../utils/hashPassword')
const { handleError } = require('./../utils/errors')
const { validateUsername, validatePassword } = require('./../utils/validators')

const ADMIN_TABLE_NAME = 'admins'

module.exports = {
  async create (req, res) {
    const { adminId } = req
    let { email, username, name, password } = req.body
    const key = crypto.randomBytes(10).toString('hex')

    if (!adminId) return res.status(401).json({ error: 'Operação não é permitida pra sua autorização' })
    
    let validUsername = validateUsername(username)
    if (!validUsername.valid) return res.status(409).json({ error: 'Username inválido', message: validUsername.error })

    let validPassword = validatePassword(password)
    if (!validPassword.valid) return res.status(409).json({ error: 'Username inválido', message: validPassword.error })

    password = await createHashPassword(password)

    return await connection(ADMIN_TABLE_NAME)
      .insert({
        id: key,
        email,
        username,
        name,
        password
      })
      .then(adminID => res.status(201).json({ created: true }))
      .catch(error => handleError(error, res, 'operação impossivel, verifique os dados'))
  },
  async updatePassword (req, res) {
    const { adminId, adminUsername } = req
    const { oldPassword, newPassword } = req.body

    if (!adminId) return res.status(401).json({ error: 'Operação não é permitida pra sua autorização' })
    
    return await connection(ADMIN_TABLE_NAME)
      .select('password')
      .where({
        id: adminId,
        username: adminUsername
      })
      .first()
      .then(async (admin) => {
        const isValidPassword = await bcrypt.compare(oldPassword, admin.password)
        if (!isValidPassword) {
          return res.status(406).json({
            error: 'Senha inválida'
          })
        }

        const hashPassword = await createHashPassword(newPassword)
        return await connection(ADMIN_TABLE_NAME)
          .where({
            id: adminId,
            username: adminUsername
          })
          .update({
            password: hashPassword
          })
          .then(adminID => res.status(200).json({ sucess: true }))
          .catch(error => handleError(error, res, 'operação impossivel'))
      })
      .catch(error => handleError(error, res, 'Credenciais não validadas'))
  },
  async updateUsername (req, res) {
    const { adminId, adminUsername } = req
    const { username } = req.body

    return await connection(ADMIN_TABLE_NAME)
      .where({
        id: adminId,
        username: adminUsername
      })
      .update({
        username
      })
      .then(adminId => res.status(200).json({ sucess: true }))
      .catch(error => handleError(error, res, 'Credenciais invalidas'))
  },
  async updateName (req, res) {
    const { adminId, adminUsername } = req
    const { name } = req.body

    return await connection(ADMIN_TABLE_NAME)
      .where({
        id: adminId,
        username: adminUsername
      })
      .update({
        name
      })
      .then(adminId => res.status(200).json({ sucess: true }))
      .catch(error => handleError(error, res, 'Credenciais invalidas'))
  },
  async updateEmail (req, res) {
    const { adminId, adminUsername } = req
    const { email } = req.body

    return await connection(ADMIN_TABLE_NAME)
      .where({
        id: adminId,
        username: adminUsername
      })
      .update({
        email
      })
      .then(adminId => res.status(200).json({ sucess: true }))
      .catch(error => handleError(error, res, 'Credenciais invalidas'))
  },
  async index (req, res) {
    const { adminId, adminUsername } = req

    return await connection(ADMIN_TABLE_NAME)
      .select('email', 'username', 'name')
      .where({
        id: adminId,
        username: adminUsername
      })
      .then(adminInformation => res.status(200).json({ admin: adminInformation }))
      .catch(error => handleError(error, res, 'Credenciais invalidas'))
  }
}