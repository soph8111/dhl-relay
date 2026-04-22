import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Runner from './pages/Runner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/runner" element={<Runner />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
