import './index.css';
import App from './App';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import { BrowserRouter } from 'react-router-dom';
import { Provider as UrqlProvider, createClient } from 'urql';
import { env, tokenKey } from './constant';

Amplify.configure({
  Auth: {
    identityPoolId: env.cognito.IDENTITY_POOL_ID,
    mandatorySignIn: true,
    region: env.cognito.REGION,
    userPoolId: env.cognito.USER_POOL_ID,
    userPoolWebClientId: env.cognito.USER_POOL_CLIENT_ID,
  },
});

const client = createClient({
  url: env.apiGateway.URL,
  fetchOptions: () => {
    return {
      headers: {
        authorization: `Bearer ${localStorage.getItem(tokenKey) || ''}`,
      },
    };
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <UrqlProvider value={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UrqlProvider>
  // </React.StrictMode>
);
