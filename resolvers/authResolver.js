const argon2d = require('argon2')
const { generarJWT } = require('../helpers/generateJWT')

module.exports = {
  Mutation: {
    login: async (_, { email, password }, { db }) => {
      try {
        const user = await db.user.findUnique({
          where: { email },
          rejectOnNotFound: () => {
            throw new Error('Email or Password is incorrect')
          },
        })

        if (user?.id) {
          const validPassword = await argon2d.verify(user?.password, password)
          if (!validPassword) {
            throw new Error('Email or Password is incorrect')
          }
        }

        const token = await generarJWT(user)

        return {
          user,
          token,
        }
      } catch (error) {
        console.error(error)
        throw error
      }
    },
  },
}
