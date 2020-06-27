const request = require('supertest')
const connection = require('./../../src/database/connection')
const app = require('./../../src/app')
const { parseISO } = require('date-fns')
const { format } = require('date-fns-tz')

const TABLE_NAME = 'schedule'

describe('tests for schedule routes', () => {
  let baseAdmin = {
    email: 'admin2@gmail.com',
    username: 'admin7582192',
    name: 'ADMIN2',
    password: 'adminpassword'
  }
  let token
  let events
  let participants

  beforeAll(async (done) => {
    const loginAdminRequest = await request(app)
      .post('/auth/admin')
      .send({
        email: baseAdmin.email,
        password: baseAdmin.password
      })
    
    token = loginAdminRequest.body.token
    done()
  })

  it('should create a valid schedule', async () => {
    const getEventsRequest = await request(app)
      .get('/event')
      .set('Authorization', `bearer ${token}`)

    const createParticipantRequest = await request(app)
      .post('/participants')
      .send({
        name: "João",
        activity: "Cantar",
        email: "serjumano17@gmail.com",
        num_phone: "082993912631",
        instagram: "matt_cardosoo"
      })

    const getParticipantsRequest = await request(app)
      .get(`/event/${getEventsRequest.body.events[0].id}/participats/`)
      .set('Authorization', `bearer ${token}`)


    const parsedDate = parseISO(getEventsRequest.body.events[0].date)
    const pattern = 'dd/MM/yyyy HH:mm'
    const output = format(parsedDate, pattern, { timeZone: 'America/Sao_Paulo' })
    const initialHour = output.split(' ')[1]
      
    // criar um array que consiste num array de objetos onde cada objeto tem { hour: 'HH:mm', idParticipant: id, idEvent: id }
    let participants = []
    let participantHour = initialHour
    getParticipantsRequest.body.participants.forEach(participant => {
      participants.push({
        participantIDFK: participant.id,
        eventIDFK: getEventsRequest.body.events[0].id,
        hour: participantHour
      })

      const [ hour , minutes ] = participantHour.split(':')
      const addHour = (Number(minutes) + 15) >= 60 ? String(Number(hour) + 1) : hour 
      const addMinutes = (Number(minutes) + 15) < 60 ? String(Number(minutes) + 15) : '00'
      participantHour = `${addHour}:${addMinutes}`
    })

    const createScheduleRequest = await request(app)
      .post('/schedule')
      .send({
        participants: participants
      })
      .set('Authorization', `bearer ${token}`)

    expect(createScheduleRequest.status).toBe(201)
    expect(createScheduleRequest.body.sucess).toBe(true)
    events = getEventsRequest.body.events
  }, 20000)

  it('should get schedule by event', async () => {
    const getScheduleRequest = await request(app)
      .get(`/events/${events[0].id}/schedule`)
      .set('Authorization', `bearer ${token}`)

    expect(getScheduleRequest.status).toBe(200)
    expect(getScheduleRequest.body.schedule).toBeDefined()
    expect(getScheduleRequest.body.schedule.participants).toBeDefined()
    getScheduleRequest.body.schedule.participants.forEach((participant) => {
      expect(participant.name).toBeDefined()
      expect(participant.hour).toBeDefined()      
    })
    participants = getScheduleRequest.body.schedule.participants
  })

  it('should update schedule by event', async () => {
    const initialHour = '22:00'
    let updatedParticipants = []

    let participantHour = initialHour
    participants.forEach((participant, index) => {
      if (index % 2 == 0) {
        participant.hour = participantHour
        updatedParticipants.push(participant.id)

        const [ hour , minutes ] = initialHour.split(':')
        const addHour = (Number(minutes) + 15) >= 60 ? String(Number(hour) + 1) : hour 
        const addMinutes = (Number(minutes) + 15) < 60 ? String(Number(minutes) + 15) : '00'
        
        participantHour = `${addHour}:${addMinutes}`
      }
    })

    const updateScheduleRequest = await request(app)
      .put(`/events/${events[0].id}/schedule`)
      .send({
        participants: participants
      })
      .set('Authorization', `bearer ${token}`)

    expect(updateScheduleRequest.status).toBe(200)
    expect(updateScheduleRequest.body.sucess).toBe(true)
  }, 25000)

  it('should send schedule to participants and admins', async () => {
    const sendScheduleRequest = await request(app)
      .get(`/events/${events[0].id}/schedule/send`)
      .set('Authorization', `bearer ${token}`)

    expect(sendScheduleRequest.status).toBe(200)
    expect(sendScheduleRequest.body.sucess).toBe(true)
  }, 20000)
})
