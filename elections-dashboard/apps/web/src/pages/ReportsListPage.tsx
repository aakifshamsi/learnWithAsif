import { Link } from 'react-router-dom';
import { useReports } from '../api/hooks/useReports';
import type { CitizenReport } from '@elections/shared';

const SENTIMENT_BADGE: Record<string, { label: string; cls: string }> = {
  POSITIVE: { label: 'Positive', cls: 'bg-green-100 text-green-700' },
  NEGATIVE: { label: 'Negative', cls: 'bg-red-100 text-red-700' },
  NEUTRAL:  { label: 'Neutral',  cls: 'bg-gray-100 text-gray-600' },
};

function ReportCard({ report }: { report: CitizenReport }) {
  const badge = SENTIMENT_BADGE[report.sentiment ?? 'NEUTRAL'] ?? SENTIMENT_BADGE['NEUTRAL'];
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-gray-800 leading-relaxed">{report.text}</p>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${badge.cls}`}>{badge.label}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-gray-400">
        {report.constituencyId && (
          <Link to={`/constituency/${report.constituencyId}`} className="text-blue-500 hover:underline">
            {report.constituencyId}
          </Link>
        )}
        {report.lat && report.lng && (
          <span>{report.lat.toFixed(3)}, {report.lng.toFixed(3)}</span>
        )}
        <span>{new Date(report.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

export function ReportsListPage() {
  const { data: reports, isLoading, error } = useReports();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Citizen Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">Sentiment analyzed by Cloudflare AI · No personal data stored</p>
        </div>
        <Link
          to="/report"
          className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium"
        >
          Submit Report
        </Link>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-xl" />)}
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
          Could not load reports. Please try again.
        </div>
      )}

      {reports && (
        <div className="space-y-3">
          {reports.map(r => <ReportCard key={r.id} report={r} />)}
          {reports.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-3xl mb-2">📋</p>
              <p>No reports yet. Be the first to submit one!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
