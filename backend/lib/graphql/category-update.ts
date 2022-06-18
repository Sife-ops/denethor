import { gql } from "apollo-server-lambda";

export const categoryUpdate = {
  typeDef: gql`
    type Mutation {
      categoryUpdate(sk: String!, name: String!, description: String): Category!
    }
  `,
};
