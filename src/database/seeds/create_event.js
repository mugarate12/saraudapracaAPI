const TABLE_NAME = 'event'

exports.seed = async function(knex) {
  return await knex(TABLE_NAME)
    .insert({
      name: 'Sarau da praça edição XV',
      date: '2021-09-20T22:00:00.000Z'
    })
}
