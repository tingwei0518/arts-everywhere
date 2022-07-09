import {
  getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence,
} from 'firebase/auth';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
import styled from 'styled-components/macro';

const HomeBtn = styled.div`
  width: 52px;
  height: 52px;
  background-color: rgb(255, 240, 0);
  margin-right: 16px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Times,sans-serif; 
  color: black;
  cursor: pointer;
`;

const Wrapper = styled.div`
  width: 30%;
  height: 80%;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

function LogInPage() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const auth = getAuth();

  function logIn(email, password) {
    setPersistence(auth, browserSessionPersistence)
      .then(() => signInWithEmailAndPassword(auth, email, password))
      .then((userCredential) => {
        // Signed in
        const { user } = userCredential;
        console.log(user);
        alert(`目前狀態:${userCredential.operationType}`);
        window.location.replace('./');
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
    <>
      <HomeBtn>
        <Link to="/">Home</Link>
      </HomeBtn>
      <Wrapper>
        <label htmlFor="email">
          E-mail
          <input type="text" placeholder="請輸入E-mail" name="email" id="email" required onChange={(e) => setUserEmail(e.target.value)} />
        </label>

        <label htmlFor="psw">
          Password
          <input type="password" placeholder="請輸入密碼" name="psw" required onChange={(e) => setUserPassword(e.target.value)} />
        </label>

        <button type="submit" onClick={() => logIn(userEmail, userPassword)}>登入</button>

        <div>
          還沒有帳戶嗎？
          <span><Link to="/signup">註冊</Link></span>
        </div>
      </Wrapper>
    </>
  );
}

export default LogInPage;
