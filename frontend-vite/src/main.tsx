import "./index.css";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import { Amplify } from "aws-amplify";
import { env } from "./constant";

Amplify.configure({
  Auth: {
    identityPoolId: env.cognito.IDENTITY_POOL_ID,
    mandatorySignIn: true,
    region: env.cognito.REGION,
    userPoolId: env.cognito.USER_POOL_ID,
    userPoolWebClientId: env.cognito.USER_POOL_CLIENT_ID,
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
