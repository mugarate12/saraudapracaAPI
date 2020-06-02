module.exports = {
  authFailed (req, res) {
    res.status(401).json({ error: "user não autorizado, por favor, verificar dados" })
  },
  authSucess (req, res) {
    // console.log(req.user)
    res.status(200).json({ ok: true})
  }
}
