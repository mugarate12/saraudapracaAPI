const bcrypt = require('bcryptjs')
const connection = require('./../database/connection')
const createToken = require('./../config/createToken')
const { handleError, throwError } = require('./../utils/errors')

const ADMIN_TABLE_NAME =  'admins'

module.exports = {
  async loginAdmin (req, res) {
    let { email, username, password } = req.body

    let search = {}
    email ? search.email = email : null
    username ? search.username = username : null

    return await connection(ADMIN_TABLE_NAME)
      .select('id', 'username', 'password')
      .where({
        ...search
      })
      .first()
      .then(async (admin) => {
        const validPassword = await bcrypt.compare(password, admin.password)
        throwError(!validPassword, res, 'administrador inválido')

        const token = createToken(admin, true)
        return res.status(200).json({ token })
      })
      .catch(error => handleError(error, res, 'informações erradas'))
  }
}