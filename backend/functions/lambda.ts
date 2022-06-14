import jwt_decode, { JwtPayload } from "jwt-decode";
import { ApolloServer, gql } from "apollo-server-lambda";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (_: any, __: any, context: any, info: any) => {
      console.log(context.userId);
      return `Hello world!`;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({
    event,
    // express,
    // context,
  }): {
    userId: string;
    // event: any;
    // context: any;
  } => {
    const decoded = jwt_decode<JwtPayload>(event.headers.authorization);

    if (!decoded.sub) {
      throw new Error("userId undefined");
    }

    return {
      userId: decoded.sub,
      // headers: event.headers,
      // functionName: context.functionName,
      // expressRequest: express.req,
      // event,
      // context,
    };
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
