import { Auth } from 'aws-amplify';
import { useState } from 'react';

export const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmCode, setConfirmCode] = useState('');

  return (
    <div className="App">
      <h1>sign up</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const res = await Auth.signUp(email, password);
            console.log('auth', res);
            setConfirmEmail(email);
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
        />
        <br />
        <input
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          value={password}
        />
        <br />
        <button type="submit">submit</button>
      </form>

      <h1>confirm</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const res = await Auth.confirmSignUp(confirmEmail, confirmCode);
            console.log('auth', res);
          } catch (e) {
            console.log(e);
          }
        }}
      >
        <input
          onChange={(e) => {
            setConfirmCode(e.target.value);
          }}
          value={confirmCode}
        />
        <br />
        <button type="submit">submit</button>
      </form>
    </div>
  );
};
