import "./App.css";
import React from "react";
import { Auth } from "aws-amplify";
import { Dev } from "./component/dev";
import { Dev2 } from "./component/dev2";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { SignIn } from "./component/sign-in";
import { SignUp } from "./component/sign-up";
import { tokenKey } from "./constant";

const Landing: React.FC = () => {
  return <div>landing</div>;
};

function App() {
  const nav = useNavigate();

  const [isSignedIn, setIsSignedIn] = React.useState(false);

  React.useEffect(() => {
    if (localStorage.getItem(tokenKey)) {
      setIsSignedIn(true);
    }
  }, []);

  return (
    <div>
      <ul>
        <li onClick={() => nav("/")}>landing</li>
        {isSignedIn ? (
          <>
            <li
              onClick={async () => {
                await Auth.signOut();
                // setAccessToken("");
                localStorage.removeItem(tokenKey);
                setIsSignedIn(false);
              }}
            >
              sign out
            </li>
            <li onClick={() => nav("/dev2")}>dev2</li>
          </>
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
          <Route path="/dev2" element={<Dev2 />} />
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
