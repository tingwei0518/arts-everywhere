import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
import styled from 'styled-components/macro';
import { db } from '../../utils/firebaseInit';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

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

function SignUpPage() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const auth = getAuth();

  function register(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const { user } = userCredential;
        console.log(user);
        setDoc(doc(db, 'users', user.uid), {
          email,
          userId: user.uid,
          userName,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ..
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

        <label htmlFor="name">
          Name
          <input type="text" placeholder="請輸入暱稱" name="name" required onChange={(e) => setUserName(e.target.value)} />
        </label>

        <button type="submit" onClick={() => register(userEmail, userPassword)}>註冊</button>

        <div>
          已經擁有帳戶？
          <span><Link to="/login">登入</Link></span>
        </div>
      </Wrapper>
    </>
  );
}

export default SignUpPage;
