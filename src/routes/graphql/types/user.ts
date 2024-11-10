/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { UUIDType } from './uuid.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (parent, args, { prisma }) => {
        return prisma.profile.findUnique({ where: { userId: parent.id } });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve: async (parent, args, { prisma }) => {
        return prisma.post.findMany({ where: { authorId: parent.id } });
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, args, { prisma }) => {
        if (!parent || !parent.id) return [];
        const users = await prisma.user.findMany({
          where: { subscribedToUser: { some: { subscriberId: parent.id } } },
        });
        users.forEach((user) => {
          user.userSubscribedTo = user.userSubscribedTo || [];
          user.subscribedToUser = user.subscribedToUser || [];
        });
        return users;
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve: async (parent, args, { prisma }) => {
        if (!parent || !parent.id) return [];
        const users = await prisma.user.findMany({
          where: { userSubscribedTo: { some: { authorId: parent.id } } },
        });
        users.forEach((user) => {
          user.userSubscribedTo = user.userSubscribedTo || [];
          user.subscribedToUser = user.subscribedToUser || [];
        });
        return users;
      },
    },
  }),
});
