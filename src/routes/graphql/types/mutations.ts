/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql';
import {
  CreateUserInput,
  CreateProfileInput,
  CreatePostInput,
  ChangeUserInput,
  ChangePostInput,
  ChangeProfileInput,
} from './inputs.js';
import { UserType } from './user.js';
import { ProfileType } from './profile.js';
import { PostType } from './post.js';
import { UUIDType } from './uuid.js';

export const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: UserType,
      args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
      resolve: async (parent, { dto }, { prisma }) => {
        return prisma.user.create({ data: dto });
      },
    },
    createPost: {
      type: PostType,
      args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
      resolve: async (parent, { dto }, { prisma }) => {
        return prisma.post.create({ data: dto });
      },
    },
    createProfile: {
      type: ProfileType,
      args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
      resolve: async (parent, { dto }, { prisma }) => {
        return prisma.profile.create({ data: dto });
      },
    },
    deleteUser: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (parent, { id }, { prisma }) => {
        await prisma.user.delete({ where: { id } });
      },
    },
    deletePost: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (parent, { id }, { prisma }) => {
        await prisma.post.delete({ where: { id } });
      },
    },
    deleteProfile: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (parent, { id }, { prisma }) => {
        await prisma.profile.delete({ where: { id } });
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (parent, { id, dto }, { prisma }) => {
        return prisma.user.update({ where: { id }, data: dto });
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (parent, { id, dto }, { prisma }) => {
        return prisma.post.update({ where: { id }, data: dto });
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (parent, { id, dto }, { prisma }) => {
        return prisma.profile.update({ where: { id }, data: dto });
      },
    },
    subscribeTo: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { userId, authorId }, { prisma }) => {
        await prisma.user.findUnique({ where: { id: userId } });
        await prisma.user.findUnique({ where: { id: authorId } });
        await prisma.subscribersOnAuthors.create({
          data: { subscriberId: userId, authorId },
        });
      },
    },
    unsubscribeFrom: {
      type: GraphQLString,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (parent, { userId, authorId }, { prisma }) => {
        await prisma.user.findUnique({ where: { id: userId } });
        await prisma.user.findUnique({ where: { id: authorId } });
        await prisma.subscribersOnAuthors.deleteMany({
          where: { subscriberId: userId, authorId },
        });
      },
    },
  },
});
