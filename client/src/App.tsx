import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
