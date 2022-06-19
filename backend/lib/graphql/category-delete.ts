import model from '../model';
import { Context } from './context';
import { gql } from 'apollo-server-lambda';

export const categoryDelete = {
  typeDef: gql`
    type Mutation {
      categoryDelete(sk: String!): Boolean!
    }
  `,
  resolver: {
    Mutation: {
      categoryDelete: async (
        _: any,
        { sk }: { sk: string },
        { userId }: Context
      ): Promise<Boolean> => {
        const category = await model.category.get({
          pk: `user:${userId}`,
          sk,
        });

        await category.delete();

        console.log('category delete', category);

        // todo: return boolean
        return true;
      },
    },
  },
};
