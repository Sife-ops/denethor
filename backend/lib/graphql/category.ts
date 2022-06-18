import { gql } from "apollo-server-lambda";

export const category = gql`
  type Category {
    pk: String
    sk: String!

    description: String
    name: String
  }
`;
