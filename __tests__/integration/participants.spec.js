const request = require('supertest')
const connection = require('./../../src/database/connection')
const app = require('./../../src/app')

const TABLE_NAME = 'participants'

describe('tests for a participants routes', () => {
  const participant1 = {
    name: "Mateus",
    activity: "Poesia",
    email: "serjumano17@gmail.com",
    num_phone: "082993912631"
  }
  let participantCreated

  beforeAll(async (done) => {
    participantCreated = await request(app)
      .post('/participants')
      .send({
        ...participant1
      })

    done()
  })

  it('should create a valid participant', async () => {
    const participantInDatabase = await connection(TABLE_NAME)
      .select('*')
      .where({
        id: participantCreated.body.id
      })
      .first()

    expect(participantCreated.status).toBe(201)
    expect(participantInDatabase.email).toBe(participant1.email)
  })
})
