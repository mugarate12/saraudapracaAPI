const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const connection = require('./../database/connection')

const ADMIN_TABLE_NAME = 'admins'
const USER_TABLE_NAME = 'users'
const JWT_SECRET = process.env.JWT_SECRET || 'Secret'

async function authUserorAdmin (req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    res.status(401).json({
      error: 'token não fornecido'
    })
  }

  const [schema, token] = authHeader.split(' ')

  try {
    const decoded = await promisify(jwt.verify)(token, JWT_SECRET)

    // verificar se além da permissão no token, o user ou admin de fato existe no meu banco
    const isUser = !decoded.isAdmin
    if (isUser) {
      return await connection (USER_TABLE_NAME)
        .select ('id', 'username')
        .where ({
          id: decoded.id,
          username: decoded.username
        })
        .first()
        .then (user => {
          req.userID = user.id
          req.username = user.username

          return next()
        })
        .catch (error => {
          res.status(401).json({ error: 'não tem permissão pra isso' })
        })
    } else {
      return await connection (ADMIN_TABLE_NAME)
        .select ('id', 'username')
        .where ({
          id: decoded.id,
          username: decoded.username
        })
        .first()
        .then (admin => {
          req.adminId = admin.id
          req.adminUsername = admin.username

          return next()
        })
        .catch(error => {
          return res.status(401).json({ error: 'não tem permissão pra isso' })
        })
    }
  } catch (error) {
    return res.status(401).json({ error: 'token inválido' })
  }
}

module.exports = authUserorAdmin
