exports.up = function(knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments()

    table.string('email').notNullable()
    table.string('username').notNullable()
    table.string('name').notNullable()
    table.string('password').notNullable()
    
    table.unique('email')
    table.unique('username')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('users')
}
