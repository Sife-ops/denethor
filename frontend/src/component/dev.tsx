import React from "react";
import { Auth } from "aws-amplify";
import { getAccessToken, setAccessToken } from "../token";

export const Dev: React.FC = () => {
  const [disabled, setDisabled] = React.useState(true);
  const [jwt, setJwt] = React.useState("");

  React.useEffect(() => {
    Auth.currentSession().then((session) => {
      const jwt = session.getAccessToken().getJwtToken();
      console.log("jwt", jwt);
      setJwt(jwt);
      setAccessToken(jwt);
      setDisabled(false);
    });
  }, []);

  return (
    <div>
      <h1>print global token</h1>
      <button
        onClick={() => {
          console.log(`_${getAccessToken()}_`);
        }}
      >
        test
      </button>

      <h1>graphql test</h1>
      <button
        disabled={disabled}
        onClick={() => {
          fetch("https://6aeocxypzd.execute-api.us-east-1.amazonaws.com", {
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
