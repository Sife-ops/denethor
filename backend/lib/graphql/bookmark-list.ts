import model, { CategoryClass } from "../model";
import { Context } from "./context";
import { gql } from "apollo-server-lambda";

const bookmarkCategories = (a: CategoryClass[], b: string) => {
  return a.reduce((acc: CategoryClass[], cur, _, arr) => {
    if (cur.bookmark === b) {
      const found = arr.find((e) => e.sk === cur.sk.split("#")[0]);
      if (found) return [...acc, found];
    }
    return acc;
  }, []);
};

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
          .query("pk")
          .eq(`user:${userId}`)
          .where("sk")
          .beginsWith("bookmark:")
          .exec();

        const categories = await model.category
          .query("pk")
          .eq(`user:${userId}`)
          .where("sk")
          .beginsWith("category:")
          .exec();

        const response = bookmarks.map((bookmark) => {
          return {
            ...bookmark,
            categories: bookmarkCategories(categories, bookmark.sk),
          };
        });

        console.log("bookmark list", response);

        return response;
      },
    },
  },
};
