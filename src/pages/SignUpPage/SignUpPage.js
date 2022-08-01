import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components/macro';
import { toast } from 'react-toastify';
import { db } from '../../utils/firebaseInit';
import { Button } from '../../components/Units';
import background from '../../assets/background7.png';
import 'react-toastify/dist/ReactToastify.css';

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
  }
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

function SignUpPage() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const auth = getAuth();

  function register(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const { user } = userCredential;
        setDoc(doc(db, 'users', user.uid), {
          email,
          userId: user.uid,
          userName,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/email-already-in-use') {
          toast.error('此帳號已被使用，請更換另一個信箱註冊，謝謝～');
        } else if (errorCode === 'auth/invalid-email') {
          toast.error('請確認輸入的信箱格式，謝謝～');
        } else if (errorCode === 'auth/weak-password') {
          toast.error('密碼需要6個字母以上，謝謝～');
        } else {
          toast.error({ errorMessage });
        }
      });
  }

  return (
    <Background>
      <HomeBtn>
        <Link to="/">Home</Link>
      </HomeBtn>
      <Wrapper>
        <Text>註冊加入 Arts Everywhere 會員</Text>
        <LabelTitle htmlFor="name">
          Name
          <input type="text" placeholder="請輸入暱稱" name="name" required onChange={(e) => setUserName(e.target.value)} />
        </LabelTitle>
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
          onClick={() => register(userEmail, userPassword)}
        >
          註冊
        </Button>
        <div>
          已經擁有帳戶？
          <span><Link to="/login">登入</Link></span>
        </div>
      </Wrapper>
    </Background>
  );
}

export default SignUpPage;
