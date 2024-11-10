import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, GraphQLSchema } from 'graphql';
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
      const result = await graphql({
        schema,
        source: query,
        contextValue: { prisma },
        variableValues: variables,
      });
      return reply.send(result);
    },
  });
};

export default plugin;
