import React from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  React.useEffect(() => {
    console.log(process.env.REACT_APP_API_URL);

    fetch("https://6aeocxypzd.execute-api.us-east-1.amazonaws.com", {
      method: "POST",
      headers: {
        // Authorization: `bearer ${REACT_APP_GITHUB_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // query: text,
        // variables,
        query: `
          query HelloQuery {
            hello
          }
        `,
      }),
    }).then(async (res) => {
      //
      const json = await res.json();
      console.log(json);
    });
  });

  return (
    <div className="App">
      {/* // */}
      hello
    </div>
  );
}

export default App;
