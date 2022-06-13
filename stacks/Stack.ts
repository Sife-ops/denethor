import { StackContext, GraphQLApi } from "@serverless-stack/resources";

export function Stack({ stack }: StackContext) {
  const api = new GraphQLApi(stack, "GraphqlApi", {
    server: {
      handler: "functions/lambda.handler",
      bundle: {
        minify: false,
      },
    },
  });
  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
