import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResultPage from '@/pages/ResultPage';
import { Header } from '@dhl-relay/ui';

function App() {
  return (
    <div className="min-h-screen m-4 md:m-5">
      <Header />
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ResultPage />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
