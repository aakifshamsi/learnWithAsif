import { useParams, Link } from 'react-router-dom';
import { StateChoropleth } from '../components/maps/StateChoropleth';
import { useFeed } from '../api/hooks/useFeed';
import { STATE_BY_CODE, PARTIES, ALLIANCE_COLORS } from '@elections/shared';

interface FeedRow {
  constituency_id: string;
  name: string;
  state: string;
  leading_party: string;
  lead_margin: number;
  percent_counted: number;
}

export function StatePage() {
  const { state } = useParams<{ state: string }>();
  const stateInfo = STATE_BY_CODE[state ?? ''];
  const { data: feed, isLoading } = useFeed(stateInfo?.name);

  const rows = (feed ?? []) as FeedRow[];

  const stateData: Record<string, { seats: number; leadingParty: string; color: string }> = {};
  if (state) {
    stateData[state] = {
      seats: rows.length,
      leadingParty: '',
      color: '#FF6B00',
    };
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/" className="text-sm text-blue-600 hover:underline">&larr; Dashboard</Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          {stateInfo?.name ?? state} — {stateInfo?.seats ?? '?'} Seats
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StateChoropleth stateData={stateData} onStateClick={() => {}} />

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">Constituency Results</h3>
          </div>
          {isLoading && <div className="p-4 text-sm text-gray-400 animate-pulse">Loading…</div>}
          <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
            {rows.map(row => {
              const party = PARTIES[row.leading_party];
              const alliance = party?.alliance ?? 'Others';
              return (
                <Link
                  key={row.constituency_id}
                  to={`/constituency/${row.constituency_id}`}
                  className="flex items-center px-4 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{row.name}</p>
                    <p className="text-xs text-gray-400">{row.percent_counted?.toFixed(1) ?? 0}% counted</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: ALLIANCE_COLORS[alliance] ?? '#6B7280' }}
                    >
                      {party?.abbr ?? row.leading_party || '—'}
                    </span>
                    <span className="text-xs text-gray-500">{row.lead_margin?.toLocaleString() ?? 0}</span>
                  </div>
                </Link>
              );
            })}
            {!isLoading && rows.length === 0 && (
              <div className="px-4 py-6 text-sm text-gray-400 text-center">No data yet for this state</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
