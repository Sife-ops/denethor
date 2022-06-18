import model from "../model";
import { Context } from "./context";
import { gql } from "apollo-server-lambda";

export const categoryList = {
  typeDef: gql`
    type Query {
      categoryList: [Category!]!
    }
  `,
  resolver: {
    Query: {
      categoryList: async (_: any, __: any, { userId }: Context) => {
        const categories = await model.category
          .query("pk")
          .eq(`user:${userId}`)
          .where("sk")
          .beginsWith("category:")
          .exec();

        const response = categories.filter((e) => !e.bookmark);

        console.log(response);

        return response;
      },
    },
  },
};
