import model, { BookmarkClass, CategoryClass } from '../model';
import { gql } from 'apollo-server-lambda';

export const bookmark = {
  typeDef: gql`
    type Bookmark {
      pk: String
      sk: String!

      description: String
      favorite: Boolean
      name: String
      url: String

      categories: [Category!]
    }
  `,
  resolver: {
    Bookmark: {
      categories: async (parent: BookmarkClass): Promise<CategoryClass[]> => {
        const bookmarkCategories: CategoryClass[] = await model.category
          .query('bookmark')
          .eq(parent.sk)
          .using('categoryBookmarkIndex')
          .exec();

        // todo: use try-catch
        if (bookmarkCategories.length > 0) {
          const categories = await model.category.batchGet(
            bookmarkCategories.map((e) => ({
              pk: e.pk,
              sk: e.sk.split('#')[0],
            }))
          );
          return categories;
        }
        return [];
      },
    },
  },
};
