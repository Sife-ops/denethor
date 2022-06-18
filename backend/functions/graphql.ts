import jwt_decode, { JwtPayload } from "jwt-decode";
import { APIGatewayEvent } from "aws-lambda";
import { ApolloServer, gql } from "apollo-server-lambda";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { Context, typeDefs, resolvers } from "../lib/graphql";
import { makeExecutableSchema, mergeSchemas } from "@graphql-tools/schema";

const hello = {
  typeDefs: gql`
    type Query {
      hello: String
    }
  `,
  resolvers: {
    Query: {
      hello: (_: any, __: any, context: Context) => {
        console.log(context.userId);
        return "Hello world!";
      },
    },
  },
};

const a = makeExecutableSchema({
  typeDefs: hello.typeDefs,
  resolvers: hello.resolvers,
});

const ree = {
  typeDefs: gql`
    type Query {
      ree: String
    }
  `,
  resolvers: {
    Query: {
      ree: (_: any, __: any, context: Context) => {
        console.log(context.userId);
        return "ree!";
      },
    },
  },
};

const b = makeExecutableSchema({
  typeDefs: ree.typeDefs,
  resolvers: ree.resolvers,
});

const c = mergeSchemas({
  schemas: [a, b],
});

/*
 * server
 */

const server = new ApolloServer({
  // typeDefs,
  // resolvers,
  schema: c,
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
