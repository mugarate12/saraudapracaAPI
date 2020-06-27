const crypto = require('crypto')
const { createHashPassword } = require('./../../utils/hashPassword')

const ADMIN_TABLE_NAME =  'admins'

exports.seed = async function(knex) {
  const key1 = crypto.randomBytes(10).toString('hex')
  const key2 = crypto.randomBytes(10).toString('hex')
  const password = 'adminpassword'
  const hashpassword = await createHashPassword(password)

  return await knex(ADMIN_TABLE_NAME)
    .insert(
      [
        {
          id: key1,
          email: 'admin@gmail.com',
          username: 'admin758219',
          name: 'ADMIN',
          password: hashpassword
        },
        {
          id: key2,
          email: 'admin2@gmail.com',
          username: 'admin7582192',
          name: 'ADMIN2',
          password: hashpassword
        }
      ])
}
