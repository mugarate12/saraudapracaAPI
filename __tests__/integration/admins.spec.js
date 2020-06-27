const request = require('supertest')
const app = require('./../../src/app')
const connection = require('./../../src/database/connection')

const TABLE_NAME = 'admins'

describe('testes for a admin routes', () => {
  let baseAdmin = {
    email: 'admin@gmail.com',
    username: 'admin758219',
    name: 'ADMIN',
    password: 'adminpassword'
  }
  let token

  it('should login a valid admin', async () => {
    const loginAdminRequest = await request(app)
      .post('/auth/admin')
      .send({
        email: baseAdmin.email,
        password: baseAdmin.password
      })
    
    expect(loginAdminRequest.status).toBe(200)
    expect(loginAdminRequest.body.token).toBeDefined()

    token = loginAdminRequest.body.token
  })

  it('should create a valid admin', async () => {
    const newAdmin = {
      email: 'isnewadmin@gmail.com',
      username: 'iamnewadmin',
      name: 'kalilinux',
      password: 'djkalilinuxdabaladinha'
    }

    const newAdminRequest = await request(app)
      .post('/admin')
      .send({ ...newAdmin })
      .set('Authorization', `bearer ${token}`)

    const invalidTokenRequest = await request(app)
      .post('/admin')
      .send({ ...newAdmin })
      .set('Authorization', `bearer ${token}ada`)

    expect(newAdminRequest.status).toBe(201)
    expect(newAdminRequest.body.created).toBe(true)
    expect(invalidTokenRequest.status).toBe(401)
    expect(invalidTokenRequest.body.error).toBe('token inválido')
  })

  it('should admin change password', async () => {
    const changePasswordRequest = await request(app)
      .put('/admin/password')
      .send({
        oldPassword: baseAdmin.password,
        newPassword: 'adminpassword2.0'
      })
      .set('Authorization', `bearer ${token}`)
    
      const invalidPasswordRequest = await request(app)
        .put('/admin/password')
        .send({
          oldPassword: `${baseAdmin.password}dd`,
          newPassword: 'adminpassword2.0'
        })
        .set('Authorization', `bearer ${token}`)

    expect(changePasswordRequest.status).toBe(200)
    expect(changePasswordRequest.body.sucess).toBe(true)
    expect(invalidPasswordRequest.status).toBe(406)
    expect(invalidPasswordRequest.body.error).toBe('Senha inválida')

  })

  it('should admin change name', async () => {
    const NEW_NAME = 'ADMINNEWNAME'

    const changeNameRequest = await request(app)
      .put('/admin/name')
      .send({
        name: NEW_NAME
      })
      .set('Authorization', `bearer ${token}`)

    const nameInDatabase = await connection(TABLE_NAME)
      .where({
        email: baseAdmin.email
      })
      .select('name')
      .first()

    expect(changeNameRequest.status).toBe(200)
    expect(changeNameRequest.body.sucess).toBe(true)
    expect(nameInDatabase.name).toBe(NEW_NAME)

    baseAdmin.name = NEW_NAME
  })

  it('should admin change email', async () => {
    const NEW_EMAIL = 'admin2email@gmail.com'

    const changeEmailRequest = await request(app)
      .put('/admin/email')
      .send({
        email: NEW_EMAIL
      })
      .set('Authorization', `bearer ${token}`)

    const emailInDatabase = await connection(TABLE_NAME)
      .select('email')
      .where({
        email: NEW_EMAIL,
        username: baseAdmin.username
      })
      .first()

    expect(changeEmailRequest.status).toBe(200)
    expect(changeEmailRequest.body.sucess).toBe(true)
    expect(emailInDatabase.email).toBe(NEW_EMAIL)

    baseAdmin.email = NEW_EMAIL
  })

  it('should admin change username', async () => {
    const NEW_USERNAME = 'admin157'

    const changeUsernameRequest = await request(app)
      .put('/admin/username')
      .send({
        username: NEW_USERNAME
      })
      .set('Authorization', `bearer ${token}`)

    const usernameInDatabase = await connection(TABLE_NAME)
      .select('username')
      .where({
        email: baseAdmin.email,
        username: NEW_USERNAME
      })
      .first()

    expect(changeUsernameRequest.status).toBe(200)
    expect(changeUsernameRequest.body.sucess).toBe(true)
    expect(usernameInDatabase.username).toBe(NEW_USERNAME)
  })
})
