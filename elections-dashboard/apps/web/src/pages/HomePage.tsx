import { useNavigate } from 'react-router-dom';
import { NationalSummary } from '../components/charts/NationalSummary';
import { StateChoropleth } from '../components/maps/StateChoropleth';
import { SwingLeaderboard } from '../components/feed/SwingLeaderboard';
import { useNationalPrediction } from '../api/hooks/usePredictions';
import { ALLIANCE_COLORS, PARTIES } from '@elections/shared';

export function HomePage() {
  const navigate = useNavigate();
  const { data: prediction, isLoading, error } = useNationalPrediction();

  // Build state data from predictions for choropleth
  const stateData: Record<string, { seats: number; leadingParty: string; color: string }> = {};
  if (prediction) {
    for (const pred of prediction.predictions) {
      const stateCode = pred.constituencyId.split('-')[0];
      const topParty = Object.entries(pred.winProbabilities).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
      const alliance = PARTIES[topParty]?.alliance ?? 'Others';
      if (!stateData[stateCode]) {
        stateData[stateCode] = { seats: 0, leadingParty: topParty, color: ALLIANCE_COLORS[alliance] ?? '#E5E7EB' };
      }
      stateData[stateCode].seats++;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">India Elections Live Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Real-time ECI data · Monte Carlo predictions · Cloudflare AI summaries</p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map(i => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-xl" />)}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          Could not load prediction data. ECI feed may not be active.
        </div>
      )}

      {prediction && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <NationalSummary prediction={prediction} />
            <StateChoropleth
              stateData={stateData}
              onStateClick={code => navigate(`/state/${code}`)}
            />
          </div>
          <div>
            <SwingLeaderboard seats={prediction.swingSeats} />
          </div>
        </div>
      )}

      {!isLoading && !prediction && !error && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🗳️</p>
          <p className="text-lg font-medium">Waiting for ECI data</p>
          <p className="text-sm mt-1">Dashboard activates when the election counting begins</p>
        </div>
      )}
    </div>
  );
}
