import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTrends } from '../api/hooks/useTrends';
import { useConstituencyPrediction } from '../api/hooks/usePredictions';
import { ConstituencyTimeSeries } from '../components/charts/ConstituencyTimeSeries';
import { LeadMarginChart } from '../components/charts/LeadMarginChart';
import { SeatProbabilityHistogram } from '../components/charts/SeatProbabilityHistogram';
import { DownloadButton } from '../components/charts/DownloadButton';
import { api } from '../api/client';

export function ConstituencyPage() {
  const { id } = useParams<{ id: string }>();
  const { data: trends, isLoading: trendsLoading } = useTrends(id ?? '');
  const { data: prediction } = useConstituencyPrediction(id ?? '');
  const [aiSummary, setAiSummary] = useState('');

  const latest = trends?.[trends.length - 1];

  useEffect(() => {
    if (!latest || !id) return;
    api.post<{ summary: string }>('/api/ai/summary', {
      constituencyId: id,
      name: id,
      state: '',
      leadingParty: latest.leadingParty,
      leadMargin: latest.leadMargin,
      percentCounted: latest.percentCounted,
    }).then(r => setAiSummary(r.summary)).catch(() => {});
  }, [id, latest?.leadingParty]);

  if (trendsLoading) {
    return <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-xl" />)}</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <Link to="/" className="text-sm text-blue-600 hover:underline">&larr; Dashboard</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">{id}</h1>
        {latest && (
          <p className="text-sm text-gray-500">
            {latest.percentCounted?.toFixed(1)}% votes counted &middot; Leading: {latest.leadingParty} by {latest.leadMargin?.toLocaleString()}
          </p>
        )}
      </div>

      {aiSummary && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-800">
          <span className="font-semibold text-xs text-blue-500 block mb-0.5">AI Analysis</span>
          {aiSummary}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prediction && <SeatProbabilityHistogram prediction={prediction} />}
      </div>

      {trends && trends.length > 0 && (
        <>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Vote Count Over Time</span>
              <DownloadButton elementId="ts-chart" filename={`${id}-timeseries`} />
            </div>
            <div id="ts-chart">
              <ConstituencyTimeSeries data={trends} name={id ?? ''} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Lead Margin</span>
              <DownloadButton elementId="margin-chart" filename={`${id}-margin`} />
            </div>
            <div id="margin-chart">
              <LeadMarginChart data={trends} />
            </div>
          </div>
        </>
      )}

      {(!trends || trends.length === 0) && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-3xl mb-2">📊</p>
          <p>No trend data yet for this constituency</p>
        </div>
      )}
    </div>
  );
}
