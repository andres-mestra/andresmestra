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
        if (!input?.authorId) {
          input.authorId = userId
        }

        const newPost = await db.post.create({
          data: { ...input },
        })

        return newPost
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    updatePost: async (_, { id, input }, { db, userId }, inf) => {
      try {
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
