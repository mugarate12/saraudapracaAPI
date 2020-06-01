const bcrypt = require('bcryptjs')

async function createHashPassword(password) {
  const salt = await bcrypt.genSalt()
  const hashPassword = await bcrypt.hash(password, salt)
  return hashPassword
}

module.exports = {
  createHashPassword
}
