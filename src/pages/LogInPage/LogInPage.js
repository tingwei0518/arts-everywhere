import {
  getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence,
} from 'firebase/auth';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
import styled from 'styled-components/macro';
import { Button } from '../../components/Units';
import background from '../../assets/background7.svg';

const HomeBtn = styled.div`
  position: fixed;
  bottom: 30px;
  left: 40px;
  width: 52px;
  height: 52px;
  background-color: rgb(255, 240, 0);
  margin-right: 16px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Times,sans-serif; 
  cursor: pointer;
  a{
    text-decoration: none;
    color: black;
  }
`;

const Background = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${background});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, .3);
`;

const Wrapper = styled.div`
  width: 30%;
  min-width: 320px;
  height: fit-content;
  background-color: white;
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

const Text = styled.div`
  margin-bottom: 25px;
`;

const LabelTitle = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  z-index: 2;
  input {
    width: 280px;
    height: 30px;
    font-size: 1rem;
    color: #0e0e0e;
    text-align: left;
    border: none;
    background-color: transparent;
    border-bottom: 1.5px solid black;
    &:focus {
      outline: none;
    }
  }
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
        if (errorCode === 'auth/user-not-found') {
          alert('找不到帳號，請重新輸入或是註冊新帳號，謝謝～');
        } else if (errorCode === 'auth/wrong-password') {
          alert('密碼輸入錯誤，請重新輸入，謝謝～');
        } else {
          alert({ errorMessage });
        }
      });
  }

  return (
    <Background>
      <HomeBtn>
        <Link to="/">Home</Link>
      </HomeBtn>
      <Wrapper>
        <Text>登入您的 Arts Everywhere 帳戶！</Text>
        <LabelTitle htmlFor="email">
          E-mail
          <input type="text" placeholder="請輸入E-mail" name="email" id="email" required onChange={(e) => setUserEmail(e.target.value)} />
        </LabelTitle>
        <LabelTitle htmlFor="psw">
          Password
          <input type="password" placeholder="請輸入密碼" name="psw" required onChange={(e) => setUserPassword(e.target.value)} />
        </LabelTitle>
        <Button
          style={{
            fontSize: '1rem', justifyContent: 'center', margin: '25px 0', borderRadius: '3px',
          }}
          type="submit"
          onClick={() => logIn(userEmail, userPassword)}
        >
          登入
        </Button>
        <div>
          還沒有帳戶嗎？
          <span><Link to="/signup">註冊</Link></span>
        </div>
      </Wrapper>
    </Background>
  );
}

export default LogInPage;
