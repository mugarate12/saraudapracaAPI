const express = require('express')
const request = require('supertest')
const crypto = require('crypto')
const connection = require('./../../src/database/connection')
const createToken = require('./../../src/config/createToken')
const authJWT = require('./../../src/middlewares/authJWT')

const ADMIN_TABLE_NAME = 'admins'
const USER_TABLE_NAME = 'users'

describe('tests for a create and validate auth token', () => {
  let user = {
    email: 'serjumano18@gmail.com',
    username: 'matt_cardosoo',
    name: 'Mateus',
    password: 'minha senha é secreta'
  }

  let admin = {
    id: crypto.randomBytes(10).toString('hex'),
    email: 'serjumano17@gmail.com',
    username: 'matt_cardosoo12931369918273',
    name: 'Mateus',
    password: 'minha senha ainda é secreta'
  }
  let userToken
  let adminToken
  
  it('should create and validate token', async () => {
    const userId = await connection(USER_TABLE_NAME)
      .insert({ ...user })
    
    const adminID = await connection(ADMIN_TABLE_NAME)
      .insert({ ...admin })

    userToken = createToken({ ...user , id: userId[0] }, false)
    adminToken = createToken({ ...admin }, true)

    const app = express()
    app.get('/test', authJWT, (req, res) => res.status(200).json({ sucess: true }))

    const userRequest = await request(app)
      .get('/test')
      .set('Authorization', `bearer ${userToken}`)

    const adminRequest = await request(app)
      .get('/test')
      .set('Authorization', `bearer ${adminToken}`)

    expect(userRequest.body.sucess).toBe(true)
    expect(adminRequest.body.sucess).toBe(true)
  })
})
