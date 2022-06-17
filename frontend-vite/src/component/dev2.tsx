import React from "react";
import { Auth } from "aws-amplify";
import { useHelloQuery } from "../generated/graphql";

export const Dev2: React.FC = () => {
  const [helloRes] = useHelloQuery();

  return (
    <div>
      <h1>amplify refresh</h1>
      <button
        onClick={async () => {
          const res = await Auth.currentSession();
          console.log(res);
        }}
      >
        test
      </button>

      <h1>hello query</h1>
      {helloRes.fetching ? (
        <div>loading</div>
      ) : (
        <div>{JSON.stringify(helloRes)}</div>
      )}
    </div>
  );
};
