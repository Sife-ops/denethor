export const env = {
  apiGateway: {
    REGION: import.meta.env.VITE_REGION,
    URL: import.meta.env.VITE_API_URL,
  },

  cognito: {
    IDENTITY_POOL_ID: import.meta.env.VITE_IDENTITY_POOL_ID,
    REGION: import.meta.env.VITE_REGION,
    USER_POOL_CLIENT_ID: import.meta.env.VITE_USER_POOL_CLIENT_ID,
    USER_POOL_ID: import.meta.env.VITE_USER_POOL_ID,
  },
};

export const tokenKey = 'denethor';
