import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Entry from './pages/Entry';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Entry />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
