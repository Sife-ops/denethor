import model, { CategoryClass } from '../model';
import { Context } from './context';
import { gql } from 'apollo-server-lambda';

export const categoryUpdate = {
  typeDef: gql`
    type Mutation {
      categoryUpdate(
        sk: String!
        name: String!
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
          name,
          sk,
        }: {
          description: string;
          name: string;
          sk: string;
        },
        { userId }: Context
      ): Promise<CategoryClass> => {
        if (!name) {
          throw new Error('invalid arguments: name');
        }

        const response = await model.category.update({
          pk: `user:${userId}`,
          sk,
          description,
          name,
        });

        console.log('category update', response);

        return response;
      },
    },
  },
};
