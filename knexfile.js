// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      database: 'sarauapidevelopment',
      user:     'root',
      password: 'majuge123'
    },
    migrations: {
      directory: './src/database/migrations'
    }
  },
  test: {
    client: 'mysql2',
    connection: {
      database: 'sarauapitest',
      user:     'root',
      password: 'majuge123'
    },
    migrations: {
      directory: './src/database/migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
