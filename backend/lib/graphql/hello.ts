import { Context } from "./context";
import { gql } from "apollo-server-lambda";

export const hello = {
  typeDef: gql`
    type Query {
      hello: String
    }
  `,
  resolver: {
    Query: {
      hello: (_: any, __: any, context: Context) => {
        // console.log(context.userId);
        return `Hello world!`;
      },
    },
  },
};
