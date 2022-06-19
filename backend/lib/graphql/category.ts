import model, { CategoryClass, BookmarkClass } from '../model';
import { gql } from 'apollo-server-lambda';

export const category = {
  typeDef: gql`
    type Category {
      pk: String!
      sk: String!

      description: String!
      name: String!

      bookmarks: [Bookmark!]!
    }
  `,
  resolver: {
    Category: {
      bookmarks: async (parent: CategoryClass): Promise<BookmarkClass[]> => {
        const categoryBookmarks = await model.category
          .query('pk')
          .eq(parent.pk)
          .where('sk')
          .beginsWith(parent.sk + '#')
          .exec();

        try {
          const bookmarks = model.bookmark.batchGet(
            categoryBookmarks.map((e) => ({
              pk: e.pk,
              // todo: remove assertion
              sk: e.bookmark!,
            }))
          );
          return bookmarks;
        } catch {
          return [];
        }
      },
    },
  },
};
