import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import EventDisplayPage from './pages/EventDisplayPage';
import LogInPage from './pages/LogInPage';
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

function App() {
  return (
    <div className="App">
      <FontStyles />
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EventDisplayPage />} />
          <Route path="/member" element={<LogInPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
