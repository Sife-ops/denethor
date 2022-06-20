import model from '../model';
import { Context } from './context';
import { gql } from 'apollo-server-lambda';

export const bookmarkDelete = {
  typeDef: gql`
    type Mutation {
      bookmarkDelete(sk: String!): Boolean!
    }
  `,
  resolver: {
    Mutation: {
      bookmarkDelete: async (
        _: any,
        { sk }: { sk: string },
        { userId }: Context
      ): Promise<boolean> => {
        const bookmark = await model.bookmark.get({
          pk: `user:${userId}`,
          sk,
        });
        await bookmark.delete();

        // todo: has 'any' type
        const bookmarkCategories = await model.category
          .query('bookmark')
          .eq(sk)
          .using('categoryBookmarkIndex')
          .exec();

        // todo: use batchDelete
        bookmarkCategories.map(async (e: any) => {
          await e.delete();
        });

        console.log('bookmark delete', bookmark, bookmarkCategories);

        return true;
      },
    },
  },
};
