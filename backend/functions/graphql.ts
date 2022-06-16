import crypto from "crypto";
import jwt_decode, { JwtPayload } from "jwt-decode";
import model from "../lib/model";
import { ApolloServer, gql } from "apollo-server-lambda";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { APIGatewayEvent } from "aws-lambda";

/*
 * schema
 */

const typeDefs = gql`
  type Bookmark {
    pk: String
    sk: String

    categories: [Category]
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
  }

  type Mutation {
    categoryCreate(name: String!, description: String): Category
  }
`;

/*
 * resolvers
 */

interface Context {
  userId?: string;
}

const resolvers = {
  Query: {
    hello: (_: any, __: any, context: any, info: any) => {
      console.log(context.userId);
      return `Hello world!`;
    },
  },

  Mutation: {
    categoryCreate: async (
      _: any,
      { description, name }: { description: string; name: string },
      context: Context,
      __: any
    ) => {
      const res = await model.category.create({
        pk: `user:${context.userId}`,
        sk: `category:${crypto.randomUUID()}`,
        name,
        description,
      });

      console.log(res);

      return res;
    },
  },
};

/*
 * server
 */

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event }: { event: APIGatewayEvent }): Context => {
    const userIdError = new Error("userId undefined");

    try {
      const { authorization } = event.headers;

      if (!authorization) {
        throw new Error("no authorization header");
      }

      const decoded = jwt_decode<JwtPayload>(authorization);

      if (!decoded.sub) {
        throw userIdError;
      }

      return {
        userId: decoded.sub,
      };
    } catch (error: any) {
      console.log(error.message);

      if (error === userIdError) {
        throw userIdError;
      }

      return {};
    }
  },

  // By default, the GraphQL Playground interface and GraphQL introspection
  // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
  //
  // If you'd like to have GraphQL Playground and introspection enabled in production,
  // install the Playground plugin and set the `introspection` option explicitly to `true`.
  introspection: true,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

export const handler = server.createHandler();
