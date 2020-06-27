const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'Secret'

function createToken (userOrAdmin, isAdmin) {
  const { id, username } = userOrAdmin

  return jwt.sign({
    id: userOrAdmin.id,
    username: userOrAdmin.username,
    isAdmin: isAdmin ? true : false
  }, JWT_SECRET, {})
}

module.exports = createToken
