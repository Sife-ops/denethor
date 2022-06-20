import { gql } from 'apollo-server-lambda';

// @ts-ignore
import { bookmarksToJSON } from 'bookmarks-to-json';

export const netscapeImport = {
  typeDef: gql`
    type Mutation {
      netscapeImport(html: String!): String!
    }
  `,
  resolver: {
    Mutation: {
      netscapeImport: (_: any, { html }: { html: string }): string => {
        const json = bookmarksToJSON(html);
        console.log('netscape import', JSON.parse(json));
        return json;
      },
    },
  },
};
