const { mapSchema, MapperKind, getDirectives } = require('@graphql-tools/utils')
const { defaultFieldResolver } = require('graphql')
const getUser = require('../helpers/getUser')

const authDirective = (directiveName, getUserFn) => {
  const typeDirectiveArgumentMaps = {}
  return {
    authDirectiveTransformer: (schema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const typeDirectives = getDirectives(schema, type)
          typeDirectiveArgumentMaps[type.name] = typeDirectives[directiveName]
          return undefined
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const fieldDirectives = getDirectives(schema, fieldConfig)
          const directiveArgumentMap =
            fieldDirectives[directiveName] ??
            typeDirectiveArgumentMaps[typeName]
          const { resolve = defaultFieldResolver } = fieldConfig
          fieldConfig.resolve = (source, args, context, info) => {
            const user = getUserFn(context.headers)
            return resolve(source, args, { ...context, user }, info)
          }
          return fieldConfig
        },
      }),
  }
}
const { authDirectiveTransformer } = authDirective('isAuth', getUser)

//TODO: falta la directiva de roles

module.exports = {
  authDirectiveTransformer,
}
