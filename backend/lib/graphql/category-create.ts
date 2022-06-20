import crypto from 'crypto';
import model, { CategoryClass } from '../model';
import { Context } from './context';
import { gql } from 'apollo-server-lambda';

export const categoryCreate = {
  typeDef: gql`
    type Mutation {
      categoryCreate(title: String!, description: String!): Category!
    }
  `,
  resolver: {
    Mutation: {
      categoryCreate: async (
        _: any,
        { description, title }: { description?: string; title: string },
        { userId }: Context
      ): Promise<CategoryClass> => {
        const response = await model.category.create({
          pk: `user:${userId}`,
          sk: `category:${crypto.randomUUID()}`,
          title,
          description,
        });

        console.log('create', response);

        return response;
      },
    },
  },
};
