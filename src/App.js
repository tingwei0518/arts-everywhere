import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EventDisplayPage from './pages/EventDisplayPage/EventDisplay';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EventDisplayPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
