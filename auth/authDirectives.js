const {
  mapSchema,
  MapperKind,
  getDirectives,
  SchemaDirectiveVisitor,
} = require('@graphql-tools/utils')
const {
  defaultFieldResolver,
  DirectiveLocation,
  GraphQLDirective,
} = require('graphql')
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

          if (directiveArgumentMap) {
            const { resolve = defaultFieldResolver } = fieldConfig
            //TODO: Hay un bug pues esta validando esto en todo, tanto en queries como en mutaciones
            //que no tienen la directiva
            fieldConfig.resolve = (source, args, context, info) => {
              const user = getUserFn(context.headers)
              return resolve(source, args, { ...context, user }, info)
            }
            return fieldConfig
          }
        },
      }),
  }
}
const { authDirectiveTransformer } = authDirective('isAuth', getUser)
//falta la directiva de roles

class IsAuthDirective extends SchemaDirectiveVisitor {
  static getDirectiveDeclaration(directiveName, schema) {
    return new GraphQLDirective({
      name: 'isAuth',
      locations: [DirectiveLocation.FIELD_DEFINITION, DirectiveLocation.OBJECT],
    })
  }

  visitObject(obj) {
    const fields = obj.getFields()

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName]
      const next = field.resolve

      //Ambas soluciones retornan null, en author
      field.resolve = (result, args, context, inf) => {
        const user = getUser(context.headers)
        return next(result, args, { ...context, user }, inf)
      }
    })
  }

  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field
    field.resolve = (result, args, context, info) => {
      const user = getUser(context.headers)
      return resolve(result, args, { ...context, user }, info)
    }
  }
}

module.exports = {
  authDirectiveTransformer,
  IsAuthDirective,
}
