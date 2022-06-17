import { Auth } from "aws-amplify";
import { tokenKey } from "../constant";
import { useState } from "react";

export const SignIn: React.FC<{
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
}> = (p) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="App">
      <h1>sign in</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const res = await Auth.signIn(email, password);
            localStorage.setItem(
              tokenKey,
              res.signInUserSession.accessToken.jwtToken
            );
            p.setIsSignedIn(true);
          } catch (e) {
            console.log(e);
          }
        }}
      >
        <input
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
          type={"email"}
        />
        <br />
        <input
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
          type={"password"}
        />
        <br />
        <button type="submit">submit</button>
      </form>
    </div>
  );
};
