import React from "react";
import { env, tokenKey } from "../constant";
// import { getAccessToken } from "../token";

export const Dev: React.FC = () => {
  const [jwt, setJwt] = React.useState("");

  return (
    <div>
      <h1>print local token</h1>
      <button
        onClick={() => {
          console.log(JSON.stringify(localStorage.getItem(tokenKey)));
        }}
      >
        test
      </button>

      <h1>graphql test</h1>
      <button
        onClick={() => {
          fetch(env.apiGateway.URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${jwt}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: `
                query HelloQuery {
                    hello
                }
              `,
            }),
          }).then(async (res) => {
            const json = await res.json();
            console.log(json);
          });
        }}
      >
        test
      </button>
    </div>
  );
};
