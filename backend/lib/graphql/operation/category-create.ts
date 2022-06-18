import { gql } from "apollo-server-lambda";

export const categoryCreate = {
  typeDef: gql`
    type Mutation {
      categoryCreate(name: String!, description: String): Category!
    }
  `,
};
