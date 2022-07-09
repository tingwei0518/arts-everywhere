import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import UserContext from './UserContext';
import api from './utils/api';
import EventDisplayPage from './pages/EventDisplayPage';
import LogInPage from './pages/LogInPage';
import SignUpPage from './pages/SignUpPage';
import FontStyles from './fontStyles';
// import './App.css';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  };
  body {
    font-size: 1rem;
    margin: 0;
    padding: 0;
    overflow-y: hidden;
    overflow-x: auto;
    overscroll-behavior: none;
    background-color: lightgrey; 
    width:100vw;
    height: 100vh;
    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

const defaultUser = { email: '', userId: '', userName: '' };

function App() {
  const [userData, setUserData] = useState(defaultUser);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid } = user;
        console.log(`uid: ${uid}`);
        api.userQuery(uid).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            setUserData(doc.data());
          });
        });
      } else {
        console.log('User is signed out');
        setUserData(defaultUser);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={userData}>
      <div className="App">
        <FontStyles />
        <GlobalStyle />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<EventDisplayPage />} />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/profile" element={<LogInPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </UserContext.Provider>
  );
}

export default App;
