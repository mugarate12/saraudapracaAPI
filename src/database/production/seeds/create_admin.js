require('dotenv').config()
const { createHashPassword } = require('./../../../utils/hashPassword')
const { v4: uuidv4 } = require('uuid')

const ADMIN_TABLE_NAME =  'admins'

exports.seed = async function(knex) {
  const key1 = uuidv4()
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