import crypto from "crypto";
import model from "../model";
import { Context } from "./context";
import { gql } from "apollo-server-lambda";

export const categoryCreate = {
  typeDef: gql`
    type Mutation {
      categoryCreate(name: String!, description: String): Category!
    }
  `,
  resolver: {
    Mutation: {
      categoryCreate: async (
        _: any,
        { description, name }: { description?: string; name: string },
        { userId }: Context
      ) => {
        const response = await model.category.create({
          pk: `user:${userId}`,
          sk: `category:${crypto.randomUUID()}`,
          name,
          description,
        });

        console.log("create", response);

        return response;
      },
    },
  },
};
