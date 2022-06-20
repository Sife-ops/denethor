import {
  Auth,
  GraphQLApi,
  StackContext,
  Table,
  ViteStaticSite,
} from '@serverless-stack/resources';

const { DOMAIN, SUBDOMAIN } = process.env;

export function stack({ stack }: StackContext) {
  const table = new Table(stack, 'table', {
    fields: {
      pk: 'string',
      sk: 'string',
      bookmark: 'string',
    },
    primaryIndex: { partitionKey: 'pk', sortKey: 'sk' },
    globalIndexes: {
      categoryBookmarkIndex: {
        partitionKey: 'bookmark',
        sortKey: 'sk',
      },
    },
  });

  const auth = new Auth(stack, 'auth', {
    login: ['email'],
  });

  const graphqlApi = new GraphQLApi(stack, 'graphqlApi', {
    authorizers: {
      jwt: {
        type: 'user_pool',
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
    },
    defaults: {
      // todo: use 'iam'?
      authorizer: 'jwt',
      function: {
        environment: {
          tableName: table.tableName,
        },
      },
    },
    server: {
      handler: 'functions/graphql.handler',
      bundle: {
        minify: false,
      },
    },
  });

  auth.attachPermissionsForAuthUsers([graphqlApi]);
  graphqlApi.attachPermissions([table]);

  const viteStaticSite = new ViteStaticSite(stack, 'viteStaticSite', {
    // todo: move to 'frontend'
    path: 'frontend-vite',
    environment: {
      VITE_REGION: stack.region,
      VITE_API_URL: graphqlApi.url,
      VITE_USER_POOL_ID: auth.userPoolId,
      VITE_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      VITE_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || '',
    },
    customDomain: {
      domainName: `${SUBDOMAIN}.${DOMAIN}`,
      domainAlias: `www.${SUBDOMAIN}.${DOMAIN}`,
      hostedZone: `${DOMAIN}`,
    },
  });

  stack.addOutputs({
    ApiEndpoint: graphqlApi.url,
    IdentityPoolId: auth.cognitoIdentityPoolId || '',
    SiteUrl: viteStaticSite.url,
    Table: table.tableName,
    UserPoolClientId: auth.userPoolClientId,
    UserPoolId: auth.userPoolId,
  });
}
