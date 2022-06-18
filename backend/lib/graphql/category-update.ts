import model from "../model";
import { Context } from "./context";
import { gql } from "apollo-server-lambda";

export const categoryUpdate = {
  typeDef: gql`
    type Mutation {
      categoryUpdate(sk: String!, name: String!, description: String): Category!
    }
  `,
  resolver: {
    Mutation: {
      categoryUpdate: async (
        _: any,
        {
          description,
          name,
          sk,
        }: {
          description?: string;
          name: string;
          sk: string;
        },
        { userId }: Context
      ) => {
        if (!name) {
          throw new Error("invalid arguments: name");
        }

        const response = await model.category.update({
          pk: `user:${userId}`,
          sk,
          name,
          description,
        });

        console.log("update", response);

        return response;
      },
    },
  },
};
