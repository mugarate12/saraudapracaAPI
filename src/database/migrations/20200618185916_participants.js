const TABLE_NAME = 'participants'

exports.up = function(knex) {
  return knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments('id').primary()

    table.string('name').notNullable()
    table.string('email').notNullable()
    table.string('activity').notNullable()
    table.string('num_phone').notNullable()
    table.string('instagram').notNullable()

    table.integer('eventIDFK').unsigned()

    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.foreign('eventIDFK').references('id').inTable('event')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(TABLE_NAME)
}