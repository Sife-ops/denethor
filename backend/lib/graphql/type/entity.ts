import { gql } from "apollo-server-lambda";

export const entity = gql`
  type Bookmark {
    pk: String
    sk: String

    categories: [Category!]!
    description: String
    favorite: Boolean
    name: String
    url: String
  }

  type Category {
    pk: String
    sk: String

    description: String
    name: String
  }

  type Query {
    hello: String
    categoryList: [Category!]!
  }

  type Mutation {
    categoryUpdate(sk: String!, name: String!, description: String): Category!
  }
`;
