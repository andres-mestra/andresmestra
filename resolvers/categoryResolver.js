const { validRole } = require('../auth/authenticated')
const { SUPER, ADMIN } = require('../helpers/allowedRoles')
const selectNodes = require('../helpers/selectNodes')

module.exports = {
  Query: {
    findCategory: async (_, { where }, { db }, inf) => {
      try {
        const category = await db.category.findFirst({
          where: {
            OR: [
              {
                id: where?.id,
              },
              {
                name: where?.name,
              },
            ],
          },
          ...selectNodes(inf),
        })

        return category
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    allCategories: async (_, args, { db }, inf) => {
      const categories = await db.category.findMany({
        ...selectNodes(inf),
      })
      //const categories = await db.category.findMany()

      return categories
    },
  },
  Mutation: {
    createCategory: validRole(SUPER)(async (_, { input }, { db }) => {
      try {
        // Create Category
        const newCategory = await db.category.create({
          data: { ...input },
        })

        return newCategory
      } catch (error) {
        console.error(error)
        throw error
      }
    }),
    updateCategory: validRole(ADMIN)(async (_, { id, input }, { db }, inf) => {
      try {
        const category = await db.category.update({
          where: { id },
          data: { ...input },
          ...selectNodes(inf),
        })

        return category
      } catch (error) {
        console.error(error)
        throw error
      }
    }),
    deleteCategory: validRole(ADMIN)(async (_, { id }, { db }) => {
      try {
        //returns record erased
        await db.category.delete({ where: { id } })

        return true
      } catch (error) {
        console.error(error)
        throw error
      }
    }),
    upsertCategory: validRole(SUPER)(async (_, { input }, { db }) => {
      const { name } = input
      try {
        const category = await db.category.upsert({
          where: { name },
          update: { ...input },
          create: { ...input },
        })

        return category
      } catch (error) {
        console.error(error)
        throw error
      }
    }),
  },
}
