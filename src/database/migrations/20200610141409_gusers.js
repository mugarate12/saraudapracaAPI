const TABLE_NAME = 'gusers'

exports.up = function(knex) {
  return knex.schema.createTable(TABLE_NAME, function (table) {
    table.string('id').primary()

    table.string('username').notNullable()
    table.string('email').notNullable()
    table.string('profileImage').notNullable()

    table.unique('id')
    table.unique('username')
    table.unique('email')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(TABLE_NAME)
}
