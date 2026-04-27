import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RunnerPage from './pages/RunnerPage';
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ResultPage />} />
        <Route path="/runner" element={<RunnerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
