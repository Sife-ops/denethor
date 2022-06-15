import React from "react";
import { useQuery } from "urql";

const HelloQuery = `
 query HelloQuery {
    hello
 }
`;

export const Dev2: React.FC = () => {
  const [res, reexec] = useQuery({
    query: HelloQuery,
  });

  const { data, fetching, error } = res;

  if (fetching) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return <div>{JSON.stringify(data)}</div>;
};
