import {
  Auth,
  GraphQLApi,
  ReactStaticSite,
  StackContext,
  Table,
} from "@serverless-stack/resources";

const { DOMAIN, SUBDOMAIN } = process.env;

export function stack({ stack }: StackContext) {
  const table = new Table(stack, "table", {
    fields: {
      pk: "string",
      sk: "string",
      bookmark: "string",
    },
    primaryIndex: { partitionKey: "pk", sortKey: "sk" },
    globalIndexes: {
      categoryBookmarkIndex: {
        partitionKey: "bookmark",
        sortKey: "sk",
      },
    },
  });

  const cognitoAuth = new Auth(stack, "cognitoAuth", {
    login: ["email"],
  });

  const graphqlApi = new GraphQLApi(stack, "graphqlApi", {
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: cognitoAuth.userPoolId,
          clientIds: [cognitoAuth.userPoolClientId],
        },
      },
    },
    defaults: {
      // todo: use 'iam'?
      authorizer: "jwt",
      function: {
        environment: {
          tableName: table.tableName,
        },
      },
    },
    server: {
      handler: "functions/graphql.handler",
      bundle: {
        minify: false,
      },
    },
  });

  cognitoAuth.attachPermissionsForAuthUsers([graphqlApi]);

  graphqlApi.attachPermissions([table]);

  const graphqlApiPublic = new GraphQLApi(stack, "graphqlApiPublic", {
    defaults: {
      function: {
        environment: {
          tableName: 'Fhqwhgads',
        },
      },
    },
    server: {
      handler: "functions/graphql.handler",
      bundle: {
        minify: false,
      },
    },
  });

  // todo: migrate to vite
  const reactSite = new ReactStaticSite(stack, "reactSite", {
    path: "frontend",
    environment: {
      REACT_APP_REGION: stack.region,
      REACT_APP_API_URL: graphqlApi.url,
      REACT_APP_USER_POOL_ID: cognitoAuth.userPoolId,
      REACT_APP_USER_POOL_CLIENT_ID: cognitoAuth.userPoolClientId,
      REACT_APP_IDENTITY_POOL_ID: cognitoAuth.cognitoIdentityPoolId || "",
    },
    customDomain: {
      domainName: `${SUBDOMAIN}.${DOMAIN}`,
      domainAlias: `www.${SUBDOMAIN}.${DOMAIN}`,
      hostedZone: `${DOMAIN}`,
    },
  });

  stack.addOutputs({
    GraphqlApiEndpoint: graphqlApi.url,
    GraphqlApiPublicEndpoint: graphqlApiPublic.url,
    IdentityPoolId: cognitoAuth.cognitoIdentityPoolId || "",
    ReactSiteUrl: reactSite.url,
    Table: table.tableName,
    UserPoolClientId: cognitoAuth.userPoolClientId,
    UserPoolId: cognitoAuth.userPoolId,
  });
}
