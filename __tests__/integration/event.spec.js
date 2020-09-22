const request = require('supertest')
const app = require('./../../src/app')
const connection = require('./../../src/database/connection')
const { parseISO } = require('date-fns')
const { zonedTimeToUtc } = require('date-fns-tz')

const TABLE_NAME = 'event'

expect.extend({
  toValidEventDate(received, object, actualYear, actualMonth, actualDay) {
    const eventDate = received.date.split('T')[0].split('-')
    const eventYear = eventDate[0]
    const eventMonth = eventDate[1]
    const eventDay = eventDate[2]

    if (actualYear > eventYear) {
      return {
        message: () => 'invalid date to event for actual period',
        pass: false
      } 
    } else if (actualYear === eventYear && actualMonth > eventMonth) {
      return {
        message: () => 'invalid date to event for actual period',
        pass: false
      } 
    } else if (actualYear === eventYear && actualMonth === eventMonth && actualDay > eventDay) {
      return {
        message: () => 'invalid date to event for actual period',
        pass: false
      } 
    } else {
      return {
        message: () => 'this date is ok',
        pass: true
      } 
    }
  }
})

describe('tests for event routes', () => {
  let baseAdmin = {
    email: 'admin2@gmail.com',
    username: 'admin7582192',
    name: 'ADMIN2',
    password: 'adminpassword'
  }
  let token
  let events

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

  it('should create a valid event', async () => {
    // const date = '2020-08-20 19:00:00'
    // const parsedDate = parseISO(date)
    const date = new Date()
    const day = date.getDate() + 1 > 29 ? 1 : date.getDate() + 1
    const month = date.getMonth() + 2
    const customDate = `2020-${month}-${day} 19:00`

    const newEvent = {
      name: "Sarau da praça edição X",
      date: customDate
    }

    const newEventRequest = await request(app)
      .post('/event')
      .send({ ...newEvent })
      .set('Authorization', `bearer ${token}`)

    const eventInDatabase = await connection(TABLE_NAME)
      .select('*')
      .where({
        name: newEvent.name
      })
      .first()

    expect(newEventRequest.status).toBe(201)
    expect(newEventRequest.body.sucess).toBe(true)
    expect(eventInDatabase.name).toBe(newEvent.name)
  })

  it('should get event not done', async () => {
    const haveValidEvent = await request(app)
      .get('/event/valid?page=1')

    // esse evento não entra pois a data já ta defasada, ou seja, é um evento que já foi realizado
    const date = '2020-06-17 19:00:00'
    const parsedDate = parseISO(date)
    const znDate = zonedTimeToUtc(parsedDate, 'America/Sao_Paulo')
    await connection(TABLE_NAME)
      .insert({
        name: 'Sarau da praça edição fake',
        date: znDate
      })

    const myDate = new Date()

    expect(haveValidEvent.status).toBe(200)
    haveValidEvent.body.events.forEach(event => {
      expect(event).toValidEventDate(event, myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate())
    })
  })

  it('should get events', async () => {
    const getEventsRequest = await request(app)
      .get('/event?page=1')
      .set('Authorization', `bearer ${token}`)

    expect(getEventsRequest.status).toBe(200)
    expect(getEventsRequest.body.events).toBeDefined()
    events = getEventsRequest.body.events
  })

  it('should get participants by event', async () => {
    const getParticipantsRequest = await request(app)
      .get(`/event/${events[0].id}/participats?page=1`)
      .set('Authorization', `bearer ${token}`)

    expect(getParticipantsRequest.status).toBe(200)
    expect(getParticipantsRequest.body.participants).toBeDefined()
  })

  it('should update event Date', async () => {
    const date = new Date()
    const day = date.getDate() + 1 > 29 ? 1 : date.getDate() + 1
    const month = date.getMonth() + 2
    const customDate = `2020-${month}-${day} 19:00`
    // const znDate = zonedTimeToUtc(date, 'America/Sao_Paulo')

    const updateDateRequest = await request(app)
      .put(`/event/${events[2].id}/date`)
      .send({
        date: customDate
      })
      .set('Authorization', `bearer ${token}`)
    
    expect(updateDateRequest.status).toBe(200)
    expect(updateDateRequest.body.sucess).toBe(true)
  })

  it('should update event Name', async () => {
    const updateNameRequest = await request(app)
      .put(`/event/${events[2].id}/name`)
      .send({
        name: 'Sarau da praça edição nova new version 200% atualizada'
      })
      .set('Authorization', `bearer ${token}`)

    expect(updateNameRequest.status).toBe(200)
    expect(updateNameRequest.body.sucess).toBe(true)
  })
})
