const selectNodes = require('../helpers/selectNodes')

module.exports = {
  Query: {
    findPost: async (_, { id }, { db }, inf) => {
      const post = await db.post.findUnique({
        where: { id },
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
    createPost: async (_, { input }, { db, userId }, inf) => {
      try {
        let data = { ...input }
        delete data?.authorId
        data = {
          ...data,
          author: { connect: { id: input.authorId ?? userId } },
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
    },
    updatePost: async (_, { id, input }, { db, userId }, inf) => {
      try {
        //TODO: user el metodo 'set' para actualizar categories
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
    },
    deletePost: async (_, { id }, { db }) => {
      try {
        //Returns record erased
        await db.post.delete({ where: { id } })
        return true
      } catch (error) {
        console.error(error)
        throw error
      }
    },
  },
}
