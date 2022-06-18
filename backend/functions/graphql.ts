import jwt_decode, { JwtPayload } from "jwt-decode";
import { APIGatewayEvent } from "aws-lambda";
import { ApolloServer } from "apollo-server-lambda";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { Context, typeDefs, resolvers } from "../lib/graphql";

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
