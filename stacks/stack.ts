import {
  StackContext,
  GraphQLApi,
  ReactStaticSite,
} from "@serverless-stack/resources";

const { DOMAIN, SUBDOMAIN } = process.env;

export function stack({ stack }: StackContext) {
  const graphqlApi = new GraphQLApi(stack, "graphqlApi", {
    server: {
      handler: "functions/lambda.handler",
      bundle: {
        minify: false,
      },
    },
  });

  const reactSite = new ReactStaticSite(stack, "reactSite", {
    path: "frontend",
    environment: {
      REACT_APP_REGION: stack.region,
      REACT_APP_API_URL: graphqlApi.url,
      // REACT_APP_USER_POOL_ID: auth.userPoolId,
      // REACT_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      // REACT_APP_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || "",
    },
    customDomain: {
      domainName: `${SUBDOMAIN}.${DOMAIN}`,
      domainAlias: `www.${SUBDOMAIN}.${DOMAIN}`,
      hostedZone: `${DOMAIN}`,
    },
  });

  stack.addOutputs({
    GraphqlApiEndpoint: graphqlApi.url,
    ReactSiteUrl: reactSite.url,
  });
}
