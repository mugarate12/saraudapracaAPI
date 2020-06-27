const TABLE_NAME = 'event'

exports.up = function(knex) {
  return knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments('id').primary()

    table.string('name').notNullable()
    table.string('date').notNullable()

    table.unique('name')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(TABLE_NAME)
}
