import model, { CategoryClass } from '../model';
import { Context } from './context';
import { gql } from 'apollo-server-lambda';

export const bookmarkUpdate = {
  typeDef: gql`
    type Mutation {
      bookmarkUpdate(
        categories: [String!]!
        description: String!
        favorite: Boolean!
        title: String!
        sk: String!
        url: String!
      ): Bookmark!
    }
  `,
  resolver: {
    Mutation: {
      bookmarkUpdate: async (
        _: any,
        {
          categories,
          description,
          favorite,
          title,
          sk,
          url,
        }: {
          categories: string[];
          description: string;
          favorite: boolean;
          title: string;
          sk: string;
          url: string;
        },
        { userId }: Context
      ) => {
        const bookmark = await model.bookmark.update({
          pk: `user:${userId}`,
          sk,
          description,
          favorite,
          title,
          url,
        });

        const bookmarkCategories: CategoryClass[] = await model.category
          .query('bookmark')
          .eq(sk)
          .using('categoryBookmarkIndex')
          .exec();

        const toDelete = bookmarkCategories.filter(
          (bc) => !categories.find((c) => bc.sk.includes(c))
        );

        if (toDelete.length > 0) {
          await model.category.batchDelete(
            toDelete.map((e) => ({ pk: e.pk, sk: e.sk }))
          );
        }

        const toCreate = categories.filter(
          (c) => !bookmarkCategories.find((bc) => bc.sk.includes(c))
        );

        let response;

        if (toCreate.length > 0) {
          await model.category.batchPut(
            toCreate.map((e) => ({
              pk: `user:${userId}`,
              sk: `${e}#${sk}`,
              bookmark: sk,
            }))
          );
        }

        if (categories.length > 0) {
          const categoriesNew = await model.category.batchGet(
            categories.map((e) => ({
              pk: `user:${userId}`,
              sk: e,
            }))
          );

          response = {
            ...bookmark,
            categories: categoriesNew,
          };
        } else {
          response = {
            ...bookmark,
            categories: [],
          };
        }

        console.log('bookmark update', response);

        return response;
      },
    },
  },
};
