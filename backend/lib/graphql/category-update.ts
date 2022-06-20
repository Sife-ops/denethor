import model, { CategoryClass } from '../model';
import { Context } from './context';
import { gql } from 'apollo-server-lambda';

export const categoryUpdate = {
  typeDef: gql`
    type Mutation {
      categoryUpdate(
        sk: String!
        title: String!
        description: String!
      ): Category!
    }
  `,
  resolver: {
    Mutation: {
      categoryUpdate: async (
        _: any,
        {
          description,
          title,
          sk,
        }: {
          description: string;
          title: string;
          sk: string;
        },
        { userId }: Context
      ): Promise<CategoryClass> => {
        if (!title) {
          throw new Error('invalid arguments: title');
        }

        const response = await model.category.update({
          pk: `user:${userId}`,
          sk,
          description,
          title,
        });

        console.log('category update', response);

        return response;
      },
    },
  },
};
