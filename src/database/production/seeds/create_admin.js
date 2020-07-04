require('dotenv').config()
const crypto = require('crypto')
const { createHashPassword } = require('./../../utils/hashPassword')

const ADMIN_TABLE_NAME =  'admins'

exports.seed = async function(knex) {
  const key1 = crypto.randomBytes(10).toString('hex')
  const password = process.env.PASSWORD
  const hashpassword = await createHashPassword(password)

  return await knex(ADMIN_TABLE_NAME)
    .insert({
      id: key1,
      email: process.env.EMAIL,
      username: process.env.USERNAME,
      name: 'ADMIN',
      password: hashpassword
    })
}