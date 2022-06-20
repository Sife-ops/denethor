import crypto from "crypto";
import model from "../model";
import { Context } from "./context";
import { gql } from "apollo-server-lambda";

export const bookmarkCreate = {
  typeDef: gql`
    type Mutation {
      bookmarkCreate(
        categories: [String!]!
        description: String!
        favorite: Boolean!
        title: String!
        url: String!
      ): Bookmark!
    }
  `,
  resolver: {
    Mutation: {
      bookmarkCreate: async (
        _: any,
        {
          categories,
          description,
          favorite,
          title,
          url,
        }: {
          categories: string[];
          description: string;
          favorite: boolean;
          title: string;
          url: string;
        },
        { userId }: Context
      ) => {
        const bookmark = await model.bookmark.create({
          pk: `user:${userId}`,
          sk: `bookmark:${crypto.randomUUID()}`,
          description,
          favorite,
          title,
          url,
        });

        if (categories.length > 0) {
          const bookmarkCategories = await model.category.batchGet(
            categories.map((e) => ({
              pk: `user:${userId}`,
              sk: e,
            }))
          );

          await model.category.batchPut(
            bookmarkCategories.map((e) => ({
              pk: e.pk,
              sk: `${e.sk}#${bookmark.sk}`,
              bookmark: bookmark.sk,
            }))
          );

          return {
            ...bookmark,
            categories: bookmarkCategories,
          };
        } else {
          return {
            ...bookmark,
            categories: [],
          };
        }
      },
    },
  },
};
