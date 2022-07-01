import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import styled from 'styled-components/macro';

const Wrapper = styled.div`
`;

function LogInPage() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const auth = getAuth();

  function register(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const { user } = userCredential;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ..
      });
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const { uid } = user;
        console.log(uid);
        // ...
      } else {
        // User is signed out
        // ...
        console.log('User is signed out');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function logIn(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const { user } = userCredential;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  }

  return (
    <Wrapper>
      <label htmlFor="email">
        E-mail
        <input type="text" placeholder="請輸入E-mail" name="email" id="email" required onChange={(e) => setUserEmail(e.target.value)} />
      </label>

      <label htmlFor="psw">
        Password
        <input type="password" placeholder="請輸入密碼" name="psw" required onChange={(e) => setUserPassword(e.target.value)} />
      </label>

      <button type="submit" onClick={() => register(userEmail, userPassword)}>註冊</button>

      <label htmlFor="email">
        E-mail
        <input type="text" placeholder="請輸入E-mail" name="email" id="email" required onChange={(e) => setUserEmail(e.target.value)} />
      </label>

      <label htmlFor="psw">
        Password
        <input type="password" placeholder="請輸入密碼" name="psw" required onChange={(e) => setUserPassword(e.target.value)} />
      </label>

      <button type="submit" onClick={() => logIn(userEmail, userPassword)}>登入</button>
    </Wrapper>
  );
}

export default LogInPage;
