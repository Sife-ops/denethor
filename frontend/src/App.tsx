// import "./App.css";
// import React from "react";
// import logo from "./logo.svg";
import { Dev } from "./component/dev";
import "./App.css";
import React from "react";
import { Auth } from "aws-amplify";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { SignIn } from "./component/sign-in";
import { SignUp } from "./component/sign-up";

const Landing: React.FC = () => {
  return <div>landing</div>;
};

function App() {
  const nav = useNavigate();

  const [isSignedIn, setIsSignedIn] = React.useState(false);

  React.useEffect(() => {
    async function checkSignedIn() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        localStorage.setItem("userId", user.username);
        setIsSignedIn(true);
      } catch (e) {
        localStorage.removeItem("userId");
        setIsSignedIn(false);
      }
    }
    checkSignedIn();
  }, []);

  return (
    <div>
      <ul>
        <li onClick={() => nav("/")}>landing</li>
        {isSignedIn ? (
          <li
            onClick={async () => {
              await Auth.signOut();
              setIsSignedIn(false);
            }}
          >
            sign out
          </li>
        ) : (
          <>
            <li onClick={() => nav("/signin")}>sign in</li>
            <li onClick={() => nav("/signup")}>sign up</li>
          </>
        )}
        <li onClick={() => nav("/dev")}>dev</li>
      </ul>

      {isSignedIn ? (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dev" element={<Dev />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/signin"
            element={<SignIn setIsSignedIn={setIsSignedIn} />}
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dev" element={<Dev />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
