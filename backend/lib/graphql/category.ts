import model, { CategoryClass } from '../model';
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
      bookmarks: async (parent: CategoryClass) => {
        const categoryBookmarks = await model.category
          .query('pk')
          .eq(parent.pk)
          .where('sk')
          .beginsWith(parent.sk + '#')
          .exec();

        if (categoryBookmarks.length > 0) {
          const bookmarks = model.bookmark.batchGet(
            categoryBookmarks.reduce((a: any, c: CategoryClass) => {
              if (!c.bookmark) return a;
              return [
                ...a,
                {
                  pk: c.pk,
                  sk: c.bookmark,
                },
              ];
            }, [])
          );

          return bookmarks;
        }

        return [];
      },
    },
  },
};
