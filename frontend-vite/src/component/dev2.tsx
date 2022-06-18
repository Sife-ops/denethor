import React from "react";
import { Auth } from "aws-amplify";
import { useHelloQuery,

  useCategoryCreateMutation,
} from "../generated/graphql";

export const Dev2: React.FC = () => {
  const [description, setDescription] = React.useState("");
  const [name, setName] = React.useState("");
  const [sk, setSk] = React.useState("");

  const [helloRes] = useHelloQuery();
  const [_, categoryCreate] = useCategoryCreateMutation();

  return (
    <div>
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
