const { validRole } = require('../auth/authenticated')
const { SUPER, ADMIN } = require('../helpers/allowedRoles')
const selectNodes = require('../helpers/selectNodes')

module.exports = {
  Query: {
    findPost: async (_, { id, slug }, { db }, inf) => {
      const post = await db.post.findFirst({
        where: {
          OR: [
            {
              id,
            },
            {
              slug,
            },
          ],
        },
        ...selectNodes(inf),
      })

      return post
    },
    allPosts: async (_, args, { db }, inf) => {
      const posts = await db.post.findMany({
        ...selectNodes(inf),
      })

      return posts
    },
  },
  Mutation: {
    createPost: validRole(SUPER)(async (_, { input }, { db, user }, inf) => {
      try {
        let data = { ...input }
        delete data?.authorId
        data = {
          ...data,
          author: { connect: { id: input.authorId ?? user.id } },
        }

        if (input?.categories) {
          data = { ...data, categories: { connect: input.categories } }
        }

        const newPost = await db.post.create({
          data,
          ...selectNodes(inf),
        })
        return newPost
      } catch (error) {
        console.error(error)
        throw error
      }
    }),
    updatePost: validRole(SUPER)(async (_, { id, input }, { db }, inf) => {
      try {
        if (input?.categories) {
          input = { ...input, categories: { set: input.categories } }
        }

        const post = await db.post.update({
          where: { id },
          data: { ...input },
          ...selectNodes(inf),
        })

        return post
      } catch (error) {
        console.error(error)
        throw error
      }
    }),
    deletePost: validRole(ADMIN)(async (_, { id }, { db }) => {
      try {
        //Returns record erased
        await db.post.delete({ where: { id } })
        return true
      } catch (error) {
        console.error(error)
        throw error
      }
    }),
  },
}
