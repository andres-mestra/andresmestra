const argon2d = require('argon2')
const { generarJWT } = require('../helpers/generateJWT')

module.exports = {
  Query: {
    findUser: async (_, { where }, { db }) => {
      try {
        const user = await db.user.findFirst({
          where: {
            OR: [
              {
                id: where?.id,
              },
              {
                email: where?.email,
              },
            ],
          },
        })

        return user
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    allUsers: async (_, args, { db }, inf) => {
      const users = await db.user.findMany()
      return users
    },
  },
  Mutation: {
    createUser: async (_, { input }, { db }) => {
      try {
        //hash password
        const { password } = input
        input.password = await argon2d.hash(password)

        // Create User
        const newUser = await db.user.create({
          data: { ...input },
        })

        // generate token
        const token = await generarJWT(newUser.id)

        return {
          user: newUser,
          token,
        }
      } catch (error) {
        console.error(error)
        throw error
      }
    },
  },
}
