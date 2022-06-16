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
    categoryList: [Category]
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

    categoryList: async (_: any, __: any, { userId }: Context, ___: any) => {
      const categories = await model.category
        .query("pk")
        .eq(`user:${userId}`)
        .where("sk")
        .beginsWith("category:")
        .exec();

      const response = categories.filter((e) => !e.bookmark);

      console.log(response);

      return response;
    },
  },

  Mutation: {
    categoryCreate: async (
      _: any,
      { description, name }: { description: string; name: string },
      { userId }: Context,
      __: any
    ) => {
      const response = await model.category.create({
        pk: `user:${userId}`,
        sk: `category:${crypto.randomUUID()}`,
        name,
        description,
      });

      console.log(response);

      return response;
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
    const noAuthHeaderError = new Error("no authorization header");

    try {
      const { authorization } = event.headers;

      if (!authorization) {
        throw noAuthHeaderError;
      }

      const decoded = jwt_decode<JwtPayload>(authorization);

      if (!decoded.sub) {
        throw new Error("userId undefined");
      }

      return {
        userId: decoded.sub,
      };
    } catch (error: any) {
      console.log(error.message);

      if (error === noAuthHeaderError) {
        return {};
      }

      throw error;
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
