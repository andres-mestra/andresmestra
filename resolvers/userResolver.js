const argon2d = require('argon2')
const { generarJWT } = require('../helpers/generateJWT')
const selectNodes = require('../helpers/selectNodes')

module.exports = {
  Query: {
    findUser: async (_, { where }, { db }, inf) => {
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
          ...selectNodes(inf),
        })

        return user
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    allUsers: async (_, args, { db }, inf) => {
      const users = await db.user.findMany({
        ...selectNodes(inf),
      })

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
        const token = await generarJWT(newUser)

        return {
          user: newUser,
          token,
        }
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    updateUser: async (_, { id, input }, { db }, inf) => {
      try {
        if (input?.password) {
          //hash password
          const { password } = input
          input.password = await argon2d.hash(password)
        }

        const user = await db.user.update({
          where: { id },
          data: { ...input },
          ...selectNodes(inf),
        })

        return user
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    deleteUser: async (_, { id }, { db }) => {
      try {
        //returns record erased
        await db.user.delete({ where: { id } })

        return true
      } catch (error) {
        console.error(error)
        throw error
      }
    },
  },
}
