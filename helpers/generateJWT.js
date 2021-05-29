const jwt = require('jsonwebtoken')

const generarJWT = ({ id, role, username }) => {
  return new Promise((resolve, reject) => {
    const payload = { id, role, username }

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: '15d',
      },
      (error, token) => {
        if (error) {
          console.log(error)
          reject('No se pudo generar el JWT')
        } else {
          resolve(token)
        }
      }
    )
  })
}

const comprobarJWT = (token = '') => {
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    return user
  } catch (error) {
    if (error.name == 'TokenExpiredError') {
      console.error(`Token is expired: ${token}`)
      throw new Error('Your token is expired')
    } else {
      console.error(`Not authorized for this resource, Token: ${token}`)
      throw new Error('You are not authorized for this resource')
    }
  }
}

module.exports = {
  generarJWT,
  comprobarJWT,
}
