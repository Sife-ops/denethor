import "./index.css";
import App from "./App";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { Amplify } from "aws-amplify";
import { BrowserRouter } from "react-router-dom";
import { Provider as UrqlProvider, createClient } from "urql";
import { getAccessToken } from "./token";

// todo: move to file
const env = {
  apiGateway: {
    REGION: process.env.REACT_APP_REGION,
    URL: process.env.REACT_APP_API_URL,
  },
  cognito: {
    REGION: process.env.REACT_APP_REGION,
    USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID,
    USER_POOL_CLIENT_ID: process.env.REACT_APP_USER_POOL_CLIENT_ID,
    IDENTITY_POOL_ID: process.env.REACT_APP_IDENTITY_POOL_ID,
  },
};

// todo: check everything, or definitions for env
if (!env.apiGateway.URL) {
  throw new Error("undefined");
}

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: env.cognito.REGION,
    userPoolId: env.cognito.USER_POOL_ID,
    identityPoolId: env.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: env.cognito.USER_POOL_CLIENT_ID,
  },
});

const client = createClient({
  url: env.apiGateway.URL,
  fetchOptions: () => {
    const token = getAccessToken();
    return {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
  <UrqlProvider value={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UrqlProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
