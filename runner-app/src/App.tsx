import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@dhl-relay/ui';
import { RunSessionProvider } from './context/RunSessionProvider';
import SelectTeamPage from './pages/SelectTeamPage';
import SelectRunnerPage from './pages/SelectRunnerPage';
import RunningPage from './pages/RunningPage';
import FinishedPage from './pages/FinishedPage';
import LivePage from './pages/LivePage';
import { Header } from '@dhl-relay/ui';
import { BottomNav } from './components/BottomNav';

export default function App() {
  return (
    <ThemeProvider>
      <div className="m-4 md:m-5 bg-background min-h-screen">
        <Header />
        <BrowserRouter>
          <RunSessionProvider>
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/select-team" replace />}
              />
              <Route path="/live" element={<LivePage />} />
              <Route path="/select-team" element={<SelectTeamPage />} />
              <Route path="/select-runner" element={<SelectRunnerPage />} />
              <Route path="/running" element={<RunningPage />} />
              <Route path="/finished" element={<FinishedPage />} />
            </Routes>
            <BottomNav />
          </RunSessionProvider>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
