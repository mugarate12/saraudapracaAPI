exports.up = function(knex) {
  return knex.schema.createTable('participants', function (table) {
    table.increments()

    table.string('name').notNullable()
    table.string('email').notNullable()
    table.string('activity').notNullable()
    table.string('num_phone').notNullable()

    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('participants')
}
