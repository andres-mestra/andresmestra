const jwt = require('jsonwebtoken')

const generarJWT = (id) => {
  return new Promise((resolve, reject) => {
    const payload = { id }

    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: '24h',
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
    const { id } = jwt.verify(token, process.env.SECRET_JWT_SEED)

    return [true, id]
  } catch (error) {
    return [false, null]
  }
}

module.exports = {
  generarJWT,
  comprobarJWT,
}
