import { gql } from "apollo-server-lambda";

export const bookmark = gql`
  type Bookmark {
    pk: String
    sk: String

    # categories: [Category!]!
    description: String
    favorite: Boolean
    name: String
    url: String
  }
`;
