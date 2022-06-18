import crypto from "crypto";
import model, { CategoryClass } from "../model";
import { Context } from "./context";
import { gql } from "apollo-server-lambda";

export const bookmarkCreate = {
  typeDef: gql`
    type Mutation {
      bookmarkCreate(
        name: String!
        description: String!
        url: String!
        # categories: [Category]!
        favorite: Boolean!
      ): Bookmark!
    }
  `,
  resolver: {
    Mutation: {
      bookmarkCreate: async (
        _: any,
        {
          //   categories,
          description,
          favorite,
          name,
          url,
        }: {
          //   categories: CategoryClass[];
          description: string;
          favorite: boolean;
          name: string;
          url: string;
        },
        { userId }: Context
      ) => {
        const response = await model.bookmark.create({
          pk: `user:${userId}`,
          sk: `bookmark:${crypto.randomUUID()}`,
          description,
          favorite,
          name,
          url,
        });

        console.log("create", response);

        return response;
      },
    },
  },
};
