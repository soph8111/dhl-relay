import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResultPage from '@/pages/ResultPage';
import { Header } from '@dhl-relay/ui';
import { ThemeProvider } from '@dhl-relay/ui';

function App() {
  return (
    <ThemeProvider>
      <div className="m-4 md:m-5">
        <Header />
        <main>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ResultPage />} />
            </Routes>
          </BrowserRouter>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
