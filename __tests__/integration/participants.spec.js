const request = require('supertest')
const connection = require('./../../src/database/connection')
const app = require('./../../src/app')

const TABLE_NAME = 'participants'

describe('tests for participants routes', () => {
  const participant1 = {
    name: "Mateus",
    activity: "Poesia",
    email: "serjumano17@gmail.com",
    num_phone: "082993912631",
    instagram: "matt_cardosoo"
  }

  it('should create a valid participant', async () => {
    const createParticipantRequest = await request(app)
      .post('/participants')
      .send({
        ...participant1
      })
    
    const participantInDatabase = await connection(TABLE_NAME)
      .select('*')
      .where({
        id: createParticipantRequest.body.id
      })
      .first()

    expect(createParticipantRequest.status).toBe(201)
    expect(createParticipantRequest.body.id).toBeGreaterThan(0)
    expect(participantInDatabase.email).toBe(participant1.email)
  }, 20000)
})
