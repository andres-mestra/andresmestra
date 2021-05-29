const { comprobarJWT } = require('./generateJWT')

const getUser = (headers) => {
  if (!headers.authorization) {
    throw new Error('No authorization token.')
  }
  const authToken = headers['authorization']
  const user = comprobarJWT(authToken)
  return user
}

module.exports = getUser
