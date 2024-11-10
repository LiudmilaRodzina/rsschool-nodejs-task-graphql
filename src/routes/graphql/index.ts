import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { GraphQLSchema, execute, validate, parse } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { RootQueryType } from './types/query.js';
import { Mutations } from './types/mutations.js';

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: Mutations,
});

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: { ...createGqlResponseSchema, response: { 200: gqlResponseSchema } },
    async handler(req, reply) {
      const { query, variables } = req.body;
      const source = query;

      const ast = parse(source);
      const validationErrors = validate(schema, ast, [depthLimit(5)]);

      if (validationErrors.length > 0) {
        return reply.send({ errors: validationErrors });
      }

      const result = await execute({
        schema,
        document: ast,
        contextValue: { prisma },
        variableValues: variables,
      });

      return reply.send(result);
    },
  });
};

export default plugin;
