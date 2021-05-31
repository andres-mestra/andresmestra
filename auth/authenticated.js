const getUser = require('../helpers/getUser')

const isAuth = (next) => async (root, args, context, info) => {
  const user = await getUser(context.headers)
  return next(root, args, { ...context, user }, info)
}

const validRole =
  (roles = []) =>
  (next) =>
  async (root, args, context, info) => {
    const user = await getUser(context.headers)
    if (roles.indexOf(user.role) === -1) {
      throw new Error('Unauthorized!')
    }

    return next(root, args, { ...context, user }, info)
  }

module.exports = {
  isAuth,
  validRole,
}
