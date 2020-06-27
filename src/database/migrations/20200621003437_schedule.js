const TABLE_NAME = 'schedule'

exports.up = function(knex) {
  return knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments('id').primary()

    table.string('hour').notNullable()

    table.integer('eventIDFK').unsigned()
    table.integer('participantIDFK').unsigned()

    table.foreign('eventIDFK').references('id').inTable('event')
    table.foreign('participantIDFK').references('id').inTable('participants')
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable(TABLE_NAME)
}
