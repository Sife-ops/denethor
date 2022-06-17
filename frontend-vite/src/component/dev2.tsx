import React from "react";
import { useHelloQuery } from "../generated/graphql";

export const Dev2: React.FC = () => {
  const [helloRes] = useHelloQuery();

  return (
    <div>
      <h1>hello query</h1>
      {helloRes.fetching ? (
        <div>loading</div>
      ) : (
        <div>{JSON.stringify(helloRes)}</div>
      )}
    </div>
  );
};
