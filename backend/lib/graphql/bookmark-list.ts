import model, { CategoryClass } from '../model';
import { Context } from './context';
import { gql } from 'apollo-server-lambda';

export const bookmarkList = {
  typeDef: gql`
    type Query {
      bookmarkList: [Bookmark!]!
    }
  `,
  resolver: {
    Query: {
      bookmarkList: async (_: any, __: any, { userId }: Context) => {
        const bookmarks = await model.bookmark
          .query('pk')
          .eq(`user:${userId}`)
          .where('sk')
          .beginsWith('bookmark:')
          .exec();

        return bookmarks;
      },
    },
  },
};
