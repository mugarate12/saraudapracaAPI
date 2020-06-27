const connection = require('./../database/connection')
const createToken = require('./../config/createToken')

const TABLE_NAME = 'gusers'

module.exports = {
  authFailed (req, res) {
    return res.status(401).json({ error: "user não autorizado, por favor, verificar dados" })
  },
  async authSucess (req, res) {
    const user = {
      id: req.user._json.sub,
      username: `google.${req.user._json.sub}.${req.user._json.email.split('@')[0]}`,
      email: req.user._json.email,
      profileImage: req.user._json.picture
    }

    return await connection(TABLE_NAME)
      .insert({
        ...user
      })
      .then(userId => {
        const token = createToken(user, false)
        return res.status(200).json({ token: token})
      })
      .catch(error => res.status(401).json(error))
  }
}
