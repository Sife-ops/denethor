import React from "react";
import { useHelloQuery } from "../generated/graphql";
import { useQuery, useMutation } from "urql";

const HelloQuery = `
 query HelloQuery {
    hello
 }
`;

const CategoryCreateMutation = `
  mutation ($name: String!, $description: String) {
    categoryCreate (name: $name, description: $description) {
      pk
      sk
      name
      description
    }
  }
`;

export const Dev2: React.FC = () => {
  const [description, setDescription] = React.useState("");
  const [name, setName] = React.useState("");

  const [res, reexec] = useQuery({
    query: HelloQuery,
  });
  const { data, fetching, error } = res;

  const [_, categoryCreate] = useMutation(CategoryCreateMutation);

  const [helloRes, helloReexec] = useHelloQuery();

  if (fetching) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return (
    <div>
      <h1>codegen test</h1>
      {helloRes.fetching ? (
        //
        <div>loading...</div>
      ) : (
        //
        <div>{JSON.stringify(helloRes)}</div>
      )}

      <h1>category create</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await categoryCreate({
            name,
            description,
          });
          console.log(res);
        }}
      >
        <input
          placeholder="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <br />
        <input
          placeholder="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        <br />
        <button type="submit">submit</button>
      </form>

      <h1>test query</h1>
      <button
        onClick={async () => {
          //
          const res = await categoryCreate({
            name: "bb",
            description: undefined,
          });
          console.log(res);
        }}
      >
        test
      </button>

      <h1>test query</h1>
      {JSON.stringify(data)}
    </div>
  );
};
