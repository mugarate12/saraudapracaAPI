function throwError (condition, res, message) {
  if (condition) {
    return res.status(406).json({
      error: message
    })
  }
}

function handleError (error, res, message) {
  return res.status(409).json({
    error: `${error.name}`,
    message: message
  })
}

module.exports = {
  throwError,
  handleError
}
