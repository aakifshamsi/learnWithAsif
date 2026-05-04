import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { StatePage } from './pages/StatePage';
import { ConstituencyPage } from './pages/ConstituencyPage';
import { VotePage } from './pages/VotePage';
import { ReportPage } from './pages/ReportPage';
import { ReportsListPage } from './pages/ReportsListPage';
import { GameroomPage } from './pages/GameroomPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 10_000 },
  },
});

function MonteagLoader() {
  useEffect(() => {
    const zoneId = import.meta.env.VITE_MONETAG_ZONE_ID;
    const domain = import.meta.env.VITE_MONETAG_DOMAIN;
    if (!zoneId || !domain || localStorage.getItem('ads-disabled') === 'true') return;

    const s = document.createElement('script');
    s.src = `https://${domain}/400/${zoneId}`;
    s.async = true;
    try {
      (document.body || document.documentElement).appendChild(s);
    } catch {
      // Non-fatal
    }
    return () => { s.remove(); };
  }, []);
  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MonteagLoader />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/state/:state" element={<StatePage />} />
            <Route path="/constituency/:id" element={<ConstituencyPage />} />
            <Route path="/vote" element={<VotePage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/reports" element={<ReportsListPage />} />
            <Route path="/gameroom" element={<GameroomPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
