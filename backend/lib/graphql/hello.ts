import { gql } from "apollo-server-lambda";

export const hello = {
  typeDef: gql`
    type Query {
      hello: String
    }
  `,
};
