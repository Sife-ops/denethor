import { gql } from "apollo-server-lambda";

export const categoryList = {
  typeDef: gql`
    type Query {
      categoryList: [Category!]!
    }
  `,
};
