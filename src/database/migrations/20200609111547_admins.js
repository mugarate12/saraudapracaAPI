const TABLE_NAME = 'admins'

exports.up = function(knex) {
  return knex.schema.createTable(TABLE_NAME, function (table) {
    table.string('id').primary()

    table.string('email').notNullable()
    table.string('username').notNullable()
    table.string('name').notNullable()
    table.string('password').notNullable()

    table.unique('id')
    table.unique('email')
    table.unique('username')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(TABLE_NAME)
}
