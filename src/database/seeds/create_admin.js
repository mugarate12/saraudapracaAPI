const ADMIN_TABLE_NAME =  'admins'

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex(ADMIN_TABLE_NAME)
    .insert({
      email: 'admin@gmail.com',
      username: 'admin758219',
      name: 'ADMIN',
      password: 'adminpassword'
    })
}
