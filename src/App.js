import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FilterPage from './pages/FilterPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FilterPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
