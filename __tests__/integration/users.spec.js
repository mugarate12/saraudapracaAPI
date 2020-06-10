const request = require('supertest')
const connection = require('./../../src/database/connection')
const app = require('./../../src/app')

const TABLE_NAME = 'users'

describe('tests for a users routes', () => {
  const user1 = {
    username: 'matt_cardoso',
    password: 'majuge',
    name: 'Mateus',
    email: 'serjumano17@gmail.com'
  }
  let userCreated

  beforeAll(async (done) => {
    userCreated = await request(app)
      .post('/users')
      .send({
        ...user1
      })

    done()
  })

  it('should create valid user', async () => {
    const userInDatabase = await connection(TABLE_NAME)
      .select('*')
      .where({
        id: userCreated.body.id
      })
      .first()

    const invalidUser = await request(app)
      .post('/users')
      .send({
        ...user1
      })

    expect(userCreated.status).toBe(201)
    expect(userInDatabase.username).toBe(user1.username)
    expect(userInDatabase.email).toBe(user1.email)
    expect(invalidUser.status).toBe(409)
    expect(invalidUser.body.message).toBe('username ou email já existem')
  })

})
