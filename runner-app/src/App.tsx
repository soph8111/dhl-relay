import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@dhl-relay/ui';
import { RunSessionProvider } from './context/RunSessionProvider';
import SelectTeamPage from '@/pages/SelectTeamPage';
import SelectRunnerPage from '@/pages/SelectRunnerPage';
import RunningPage from '@/pages/RunningPage';
import FinishedPage from '@/pages/FinishedPage';

export default function App() {
  return (
    <ThemeProvider>
      <div className="m-4 md:m-5 bg-background min-h-screen">
        <BrowserRouter>
          <RunSessionProvider>
            <Routes>
              <Route path="/" element={<SelectTeamPage />} />
              <Route path="/select-runner" element={<SelectRunnerPage />} />
              <Route path="/running" element={<RunningPage />} />
              <Route path="/finished" element={<FinishedPage />} />
            </Routes>
          </RunSessionProvider>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
