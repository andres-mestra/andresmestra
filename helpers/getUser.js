const { comprobarJWT } = require('./generateJWT')

const getUser = async (headers) => {
  try {
    if (!headers.authorization) {
      throw new Error('No authorization token.')
    }

    const user = await comprobarJWT(headers['authorization'])
    return user
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = getUser
