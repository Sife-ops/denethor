import { gql } from "apollo-server-lambda";

export const categoryDelete = {
  typeDef: gql`
    type Mutation {
      categoryDelete(sk: String!): Category!
    }
  `,
};
